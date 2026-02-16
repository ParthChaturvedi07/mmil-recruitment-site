import dotenv from "dotenv";
import createVectorStore from "./utils/vectorStore.js";

dotenv.config();
await createVectorStore();
