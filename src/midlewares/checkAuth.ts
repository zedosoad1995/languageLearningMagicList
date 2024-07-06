import { UserModel } from "@/models/user";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtoken = req.cookies["session"]?.jwt;

  if (!jwtoken) {
    return res.status(401).send({ message: "No JWT Token" });
  }

  try {
    const payload = jwt.verify(jwtoken, process.env.JWT_KEY!) as {
      email: string;
    };

    const user = await UserModel.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return res.status(401).send({ message: "User does not exist" });
    }

    req.loggedUser = user;

    return next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  }
};
