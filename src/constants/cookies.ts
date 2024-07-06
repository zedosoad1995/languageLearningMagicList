import { CookieOptions } from "express";

export let cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};
