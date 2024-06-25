import { Router } from "express";
import wordsRoute from "./words";

const api = Router().use("/words", wordsRoute);

export default Router().use("/api", api);
