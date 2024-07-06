import { cookieOptions } from "@/constants/cookies";
import { comparePasswords } from "@/helpers/password";
import { UserModel } from "@/models/user";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  const isPasswordMatch = await comparePasswords(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  const userJwt = jwt.sign(
    {
      email: user.email,
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

  res.status(200).json({ user: UserModel.dto(user) });
};

export const signOut = (req: Request, res: Response) => {
  res.clearCookie("session", cookieOptions);

  res.status(204).send();
};
