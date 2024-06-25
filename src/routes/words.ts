import { Router } from "express";
import {
  pickDailyWords,
  createWord,
  editWord,
  getWords,
} from "@/controllers/words";
import { validateForm } from "@/midlewares/validateForm";
import { createWordSchema } from "@/schemas/word/createWord";
import { editWordSchema } from "@/schemas/word/editWord";

const router = Router();

router.get("/", getWords);
router.put("/pick-daily", pickDailyWords);
router.post("/", validateForm(createWordSchema), createWord);
router.patch("/:wordId", validateForm(editWordSchema), editWord);

export default router;
