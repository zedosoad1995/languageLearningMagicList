import { Router } from "express";
import { pickDailyWords, createWord } from "@/controllers/words";
import { validateForm } from "@/midlewares/validateForm";
import { createWordSchema } from "@/schemas/word/createWord";

const router = Router();

router.put("/pick-daily", pickDailyWords);
router.post("/", validateForm(createWordSchema), createWord);

export default router;
