import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "API running" });
});

export default app;
