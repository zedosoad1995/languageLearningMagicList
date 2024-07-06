import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import routes from "@/routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(routes);

export { app };
