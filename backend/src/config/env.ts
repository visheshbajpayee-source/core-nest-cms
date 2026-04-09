import dotenv from "dotenv";

dotenv.config();

export const env = {
	JWT_SECRET: process.env.JWT_SECRET as string,
	MONGO_URI: process.env.MONGO_URI as string,
	PORT: process.env.PORT || "5000",
	NODE_ENV: process.env.NODE_ENV || "development",
};

