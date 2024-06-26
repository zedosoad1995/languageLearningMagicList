import { daysDiff } from "@/helpers/date";
import { SettingsModel } from "@/models/settings";
import { WordModel } from "@/models/word";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

type SortableFields = "knowledge" | "relevance" | "original" | "translation";

export const getWords = async (req: Request, res: Response) => {
  const { sortBy, order } = req.query;
  const tranformedOrder = order === "desc" ? "desc" : "asc";

  const orderQuery: Prisma.WordOrderByWithRelationInput = {};

  if (
    typeof sortBy === "string" &&
    ["knowledge", "relevance", "original", "translation"].includes(sortBy)
  ) {
    orderQuery[sortBy as SortableFields] = tranformedOrder;
  } else {
    orderQuery.original = tranformedOrder;
  }

  const words = await WordModel.findMany({
    orderBy: orderQuery,
  });

  res.status(201).send({ words, total: words.length });
};

export const getWord = async (req: Request, res: Response) => {
  const wordId = req.params.wordId;

  const word = await WordModel.findUnique({ where: { id: wordId } });

  if (!word) {
    return res.status(404).send({ message: "Word not found" });
  }

  res.status(200).send(word);
};

export const pickDailyWords = async (req: Request, res: Response) => {
  const settings = await SettingsModel.findFirst();

  if (!settings) {
    return res.status(500).send({ message: "No settings" });
  }

  let pickedWords: Prisma.PromiseReturnType<typeof WordModel.findMany> = [];

  const now = new Date();
  const wordsPickedToday =
    settings.words_picked_at && daysDiff(settings.words_picked_at, now) === 0;

  if (wordsPickedToday) {
    pickedWords = await WordModel.findMany({
      where: { is_picked: true },
      take: settings.words_per_day,
    });
  } else {
    pickedWords = await WordModel.pickRandomWordsByScore(
      settings.words_per_day
    );

    await SettingsModel.update({
      where: { id: settings.id },
      data: { words_picked_at: new Date() },
    });

    await WordModel.updateMany({
      data: {
        is_picked: false,
      },
    });

    await WordModel.updateMany({
      where: {
        id: {
          in: pickedWords.map(({ id }) => id),
        },
      },
      data: {
        is_picked: true,
      },
    });
  }

  res.status(200).send({ words: pickedWords });
};

export const createWord = async (req: Request, res: Response) => {
  const { original, translation, knowledge, relevance } = req.body;

  const newWord = await WordModel.create({
    data: {
      original,
      translation,
      knowledge,
      relevance,
    },
  });

  res.status(201).send(newWord);
};

export const editWord = async (req: Request, res: Response) => {
  const wordId = req.params.wordId;

  const word = await WordModel.findUnique({ where: { id: wordId } });

  if (!word) {
    return res.status(404).send({ message: "Word not found" });
  }

  const updatedWord = await WordModel.update({
    where: {
      id: wordId,
    },
    data: req.body,
  });

  res.status(200).send(updatedWord);
};

export const deleteWord = async (req: Request, res: Response) => {
  const wordId = req.params.wordId;

  const word = await WordModel.findUnique({ where: { id: wordId } });

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
