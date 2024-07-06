import { Request, Response } from "express";
import { UserModel } from "@/models/user";
import { hashPassword } from "@/helpers/password";
import jwt from "jsonwebtoken";
import { cookieOptions } from "@/constants/cookies";

export const createUser = async (req: Request, res: Response) => {
  const password = await hashPassword(req.body.password);

  const userExists = await UserModel.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (userExists) {
    return res.status(409).send({ message: "Email already exists" });
  }

  const createdUser = await UserModel.create({
    data: {
      email: req.body.email,
      password,
      settings: {
        create: {
          words_per_day: req.body.words_per_day ?? 5,
        },
      },
    },
  });

  const userJwt = jwt.sign(
    {
      email: createdUser.email,
    },
    process.env.JWT_KEY!
  );

  res.cookie(
    "session",
    {
      jwt: userJwt,
    },
    cookieOptions
  );

  res.status(201).send(UserModel.dto(createdUser));
};
