import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Auth route working" });
});

export default router;
