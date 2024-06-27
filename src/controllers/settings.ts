import { daysDiff } from "@/helpers/date";
import { SettingsModel } from "@/models/settings";
import { WordModel } from "@/models/word";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export const getSettings = async (req: Request, res: Response) => {
  const settings = await SettingsModel.findFirst();
  if (!settings) {
    return res.status(500).send({ message: "No settings" });
  }

  res.status(200).send(settings);
};

export const editSettings = async (req: Request, res: Response) => {
  const settings = await SettingsModel.findFirst();
  if (!settings) {
    return res.status(500).send({ message: "No settings" });
  }

  const updatedSettings = await SettingsModel.update({
    where: {
      id: settings.id,
    },
    data: req.body,
  });

  res.status(200).send(updatedSettings);
};
