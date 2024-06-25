import { Router } from "express";
import { pickDailyWords } from "@/controllers/words";

const router = Router();

router.put("/pick-daily", pickDailyWords);

export default router;
