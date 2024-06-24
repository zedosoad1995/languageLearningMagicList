import express from "express";
import "express-async-errors";
import { json } from "body-parser";

const app = express();
app.use(json());

export { app };
