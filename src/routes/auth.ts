import { signIn, signOut } from "@/controllers/auth";
import { createUser } from "@/controllers/users";
import { validateForm } from "@/midlewares/validateForm";
import { signInSchema } from "@/schemas/auth/signIn";
import { Router } from "express";

const router = Router();

router.put("/login", validateForm(signInSchema), signIn);
router.put("/logout", signOut);

export default router;
