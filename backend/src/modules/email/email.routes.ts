import express from "express";
const router = express.Router();
import { sendMail } from "./email";

router.post("/send", sendMail);

export default router;
