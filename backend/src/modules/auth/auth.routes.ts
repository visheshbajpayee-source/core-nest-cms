import { Router } from "express";
import loginController from "./auth.controller";
import { validate } from "../../common/middlewares/validate.middleware";
import { loginSchema } from "./auth.validation";
import registerController from "./register.controller";

const router: Router = Router();

router.post("/", validate(loginSchema), loginController);
router.post("/register", registerController);

export default router;