import { daysDiff } from "@/helpers/date";
import { parseBoolean } from "@/helpers/query";
import { SettingsModel } from "@/models/settings";
import { WordModel } from "@/models/word";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

type AllowedSortingFields = keyof Prisma.WordOrderByWithRelationInput;

const allowedSortingFields: AllowedSortingFields[] = [
  "knowledge",
  "relevance",
  "original",
  "translation",
  "created_at",
];

export const getWords = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const { sortBy, order, search } = req.query;
  const tranformedOrder = order === "desc" ? "desc" : "asc";
  const isLearned = parseBoolean(req.query.isLearned as string | undefined);

  const orderQuery: Prisma.WordOrderByWithRelationInput = {};

  if (
    typeof sortBy === "string" &&
    (allowedSortingFields as string[]).includes(sortBy)
  ) {
    orderQuery[sortBy as AllowedSortingFields] = tranformedOrder;
  } else {
    orderQuery.original = tranformedOrder;
  }

  const whereQuery: Prisma.WordWhereInput = {
    user_id: loggedUser.id,
  };
  if (typeof isLearned === "boolean") {
    whereQuery.is_learned = isLearned;
  }

  if (typeof search === "string" && search.length) {
    whereQuery.OR = [
      { original: { contains: search, mode: "insensitive" } },
      { translation: { contains: search, mode: "insensitive" } },
    ];
  }

  const words = await WordModel.findMany({
    where: whereQuery,
    orderBy: orderQuery,
  });

  res.status(200).send({ words, total: words.length });
};

export const getWord = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;
  const wordId = req.params.wordId;

  const word = await WordModel.findUnique({
    where: { id: wordId, user_id: loggedUser.id },
  });

  if (!word) {
    return res.status(404).send({ message: "Word not found" });
  }

  res.status(200).send(word);
};

export const pickDailyWords = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const settings = await SettingsModel.findUnique({
    where: {
      user_id: loggedUser.id,
    },
  });

  if (!settings) {
    return res.status(500).send({ message: "No settings" });
  }

  let pickedWords: Prisma.PromiseReturnType<typeof WordModel.findMany> = [];

  const now = new Date();
  const wereWordsPickedToday =
    settings.words_picked_at && daysDiff(settings.words_picked_at, now) === 0;

  if (wereWordsPickedToday) {
    pickedWords = await WordModel.findMany({
      where: { is_picked: true, user_id: loggedUser.id },
      take: settings.words_per_day,
    });
  } else {
    pickedWords = await WordModel.pickRandomWordsByScore(
      settings.words_per_day,
      loggedUser.id
    );

    await SettingsModel.update({
      where: { id: settings.id },
      data: { words_picked_at: new Date() },
    });

    await WordModel.updateMany({
      where: {
        user_id: loggedUser.id,
      },
      data: {
        is_picked: false,
      },
    });

    await WordModel.updateMany({
      where: {
        user_id: loggedUser.id,
        id: {
          in: pickedWords.map(({ id }) => id),
        },
      },
      data: {
        is_picked: true,
      },
    });
  }

  const seenWords = pickedWords.filter(
    ({ last_seen }) => last_seen && daysDiff(last_seen, now) <= 0
  );
  const unseenWords = pickedWords.filter(
    ({ last_seen }) => !last_seen || daysDiff(last_seen, now) > 0
  );

  const totalWordsToLearn = await WordModel.count({
    where: {
      user_id: loggedUser.id,
      is_learned: false,
    },
  });

  res.status(200).send({ seenWords, unseenWords, totalWordsToLearn });
};

export const createWord = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const { original, translation, knowledge, relevance } = req.body;

  const newWord = await WordModel.create({
    data: {
      original,
      translation,
      knowledge,
      relevance,
      user: {
        connect: {
          id: loggedUser.id,
        },
      },
    },
  });

  res.status(201).send(newWord);
};

export const editWord = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const wordId = req.params.wordId;
  const { isSeen, ...body } = req.body;

  const word = await WordModel.findUnique({
    where: { id: wordId, user_id: loggedUser.id },
  });

  if (!word) {
    return res.status(404).send({ message: "Word not found" });
  }

  const data = body;
  if (isSeen) {
    data.last_seen = new Date();
  }

  const updatedWord = await WordModel.update({
    where: {
      id: wordId,
      user_id: loggedUser.id,
    },
    data,
  });

  res.status(200).send(updatedWord);
};

export const deleteWord = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;
  const wordId = req.params.wordId;

  const word = await WordModel.findUnique({
    where: { id: wordId, user_id: loggedUser.id },
  });

  if (!word) {
    return res.status(404).send({ message: "Word not found" });
  }

  await WordModel.delete({
    where: {
      id: wordId,
    },
  });

  res.sendStatus(204);
};

export const startTraining = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const settings = await SettingsModel.findUnique({
    where: { user_id: loggedUser.id },
  });
  if (!settings) {
    return res.status(500).send({ message: "No settings" });
  }

  await SettingsModel.update({
    where: {
      id: settings.id,
      user_id: loggedUser.id,
    },
    data: {
      training_try_num: 0,
    },
  });

  await WordModel.updateMany({
    where: {
      user_id: loggedUser.id,
    },
    data: {
      last_training_try: -1,
    },
  });

  const totalWordsToLearn = await WordModel.count({
    where: {
      user_id: loggedUser.id,
    },
  });

  res.status(200).send({ totalWordsToLearn });
};

export const pickNextWordTraining = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const settings = await SettingsModel.findUnique({
    where: { user_id: loggedUser.id },
  });
  if (!settings) {
    return res.status(500).send({ message: "No settings" });
  }

  await SettingsModel.update({
    where: {
      id: settings.id,
      user_id: loggedUser.id,
    },
    data: {
      training_try_num: settings.training_try_num + 1,
    },
  });

  const pickedWord = await WordModel.pickRandomWordTraining(
    settings.training_try_num,
    loggedUser.id
  );
  if (!pickedWord) {
    return res.status(500).send({ message: "Could not pick word" });
  }

  await WordModel.update({
    data: {
      last_training_try: settings.training_try_num,
      last_seen: new Date(),
    },
    where: {
      id: pickedWord.id,
      user_id: loggedUser.id,
    },
  });

  res.status(200).send(pickedWord);
};
