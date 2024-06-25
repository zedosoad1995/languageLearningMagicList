import { daysDiff } from "@/helpers/date";
import { SettingsModel } from "@/models/settings";
import { WordModel } from "@/models/word";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

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

/* export const createWord = async (req: Request, res: Response) => {
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
}; */
