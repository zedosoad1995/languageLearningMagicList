import { Prisma, User } from "@prisma/client";
import { IUser } from "./user";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      loggedUser?: IUser;
    }
  }
}
