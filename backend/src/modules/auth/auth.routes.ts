import { Router, Request, Response } from "express";
import { loginController } from "./auth.controller";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Auth route working" });
});

router.post("/login", loginController);
export default router;
