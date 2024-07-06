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
import { checkAuth } from "@/midlewares/checkAuth";

const router = Router();

router.get("/", checkAuth, getWords);
router.get("/:wordId", checkAuth, getWord);
router.put("/pick-daily", checkAuth, pickDailyWords);
router.put("/training/start", checkAuth, startTraining);
router.post("/training/next-word", checkAuth, pickNextWordTraining);
router.post("/", checkAuth, validateForm(createWordSchema), createWord);
router.patch("/:wordId", checkAuth, validateForm(editWordSchema), editWord);
router.delete("/:wordId", checkAuth, deleteWord);

export default router;
