import { createUser } from "@/controllers/users";
import { validateForm } from "@/midlewares/validateForm";
import { createUserSchema } from "@/schemas/user/createUser";
import { Router } from "express";

const router = Router();

router.post("/users", validateForm(createUserSchema), createUser);

export default router;
