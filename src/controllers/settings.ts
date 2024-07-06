import { SettingsModel } from "@/models/settings";
import { Request, Response } from "express";

export const getSettings = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const settings = await SettingsModel.findUnique({
    where: {
      user_id: loggedUser.id,
    },
  });
  if (!settings) {
    return res.status(500).send({ message: "No settings" });
  }

  res.status(200).send(settings);
};

export const editSettings = async (req: Request, res: Response) => {
  const loggedUser = req.loggedUser!;

  const settings = await SettingsModel.findUnique({
    where: {
      user_id: loggedUser.id,
    },
  });
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
