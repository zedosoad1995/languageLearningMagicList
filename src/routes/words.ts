import { Router } from "express";
import {
  pickDailyWords,
  createWord,
  editWord,
  getWords,
  deleteWord,
  getWord,
  startTraining,
  pickNextWordTraining,
} from "@/controllers/words";
import { validateForm } from "@/midlewares/validateForm";
import { createWordSchema } from "@/schemas/word/createWord";
import { editWordSchema } from "@/schemas/word/editWord";

const router = Router();

router.get("/", getWords);
router.get("/:wordId", getWord);
router.put("/pick-daily", pickDailyWords);
router.put("/training/start", startTraining);
router.post("/training/next-word", pickNextWordTraining);
router.post("/", validateForm(createWordSchema), createWord);
router.patch("/:wordId", validateForm(editWordSchema), editWord);
router.delete("/:wordId", deleteWord);

export default router;
