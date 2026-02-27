import mongoose from "mongoose";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (uri: string): Promise<void> => {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
      });
      console.log("✅ MongoDB Atlas Connected Successfully");
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      console.error(
        `❌ MongoDB Connection Failed (attempt ${attempt}/${maxRetries}):`,
        (error as Error).message
      );

      if (isLastAttempt) {
        console.error(
          "ℹ️ Network check failed for one or more Atlas shard hosts. Verify Atlas Network Access whitelist and local ISP/firewall rules for *.mongodb.net:27017."
        );
        console.error(error);
        process.exit(1);
      }

      await sleep(5000);
    }
  }
};
