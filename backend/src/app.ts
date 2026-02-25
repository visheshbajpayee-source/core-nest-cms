import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./common/middlewares/error.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "API running" });
});

app.use(errorHandler);
app.use(notFoundHandler);
export default app;
