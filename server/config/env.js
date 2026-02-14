import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
  JWT_SECRET:process.env.JWT_SECRET,
  GEMINI_API_KEY:process.env.GEMINI_API_KEY
};
