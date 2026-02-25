import express, { Application } from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { errorHandler } from "./common/middlewares/error.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/v1", routes);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "API running" });
});

app.use(errorHandler);

export default app;
