import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

const startServer = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not defined");
    process.exit(1);
  }

  await connectDB(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer(); 
