import { Router } from "express";
import wordsRoute from "./words";
import settingsRoute from "./settings";

const api = Router().use("/words", wordsRoute).use("/settings", settingsRoute);

export default Router().use("/api", api);
