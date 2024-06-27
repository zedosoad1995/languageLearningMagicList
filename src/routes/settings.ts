import { Router } from "express";
import { validateForm } from "@/midlewares/validateForm";
import { editSettingsSchema } from "@/schemas/settings/editSettings";
import { editSettings, getSettings } from "@/controllers/settings";

const router = Router();

router.get("/", getSettings);
router.patch("/", validateForm(editSettingsSchema), editSettings);

export default router;
