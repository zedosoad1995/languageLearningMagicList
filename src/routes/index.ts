import { Router } from "express";
import usersRoute from "./users";
import wordsRoute from "./words";
import settingsRoute from "./settings";

const api = Router()
  .use("/words", wordsRoute)
  .use("/settings", settingsRoute)
  .use("/users", usersRoute);

export default Router().use("/api", api);
