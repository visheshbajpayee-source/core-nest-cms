import { Router } from "express";
import loginController  from "./auth.controller";
import { validate } from "../../common/middlewares/validate.middleware";
import { loginSchema } from "./auth.validation";

const router : Router = Router();

router.post("/", validate(loginSchema), loginController);

export default router;
