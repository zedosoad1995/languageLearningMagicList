import prisma from "@/helpers/prisma";
import { IUser } from "@/types/user";
import { omit } from "lodash";

const dto = (user: IUser) => {
  return omit(user, "password");
};

export const UserModel = { ...prisma.user, dto };
