import { Router, Request, Response } from "express";
import usersRoute from "./users";
import wordsRoute from "./words";
import settingsRoute from "./settings";
import authRoute from "./auth";

const api = Router()
  .use("/words", wordsRoute)
  .use("/settings", settingsRoute)
  .use("/users", usersRoute)
  .use("/auth", authRoute)
  .use("/healthCheck", (req: Request, res: Response) => {
    res.status(200).json({ healthy: true });
  });

export default Router().use("/api", api);
