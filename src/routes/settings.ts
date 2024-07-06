import { Router } from "express";
import { validateForm } from "@/midlewares/validateForm";
import { editSettingsSchema } from "@/schemas/settings/editSettings";
import { editSettings, getSettings } from "@/controllers/settings";
import { checkAuth } from "@/midlewares/checkAuth";

const router = Router();

router.get("/", checkAuth, getSettings);
router.patch("/", checkAuth, validateForm(editSettingsSchema), editSettings);

export default router;
