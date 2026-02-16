import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ENV } from "../config/env.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createVectorStore = async () => {
  console.log("📄 Reading PDF...");
  const pdfPath = path.join(__dirname, "../data/data.pdf");
  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();

  console.log("✂️  Splitting text...");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  console.log("🧠 Creating embeddings with gemini-embedding-001...");
  
  // --- CORRECT MODEL CONFIGURATION ---
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: ENV.GEMINI_API_KEY,
    model: "gemini-embedding-001", // The ONLY model you have access to
    // taskType is REMOVED (not supported by this model)
  });
  // -----------------------------------

  console.log("💾 Building vector database...");
  const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);
  await vectorStore.save("./vectorstore");

  console.log("✅ Vector store created successfully!");
};

export default createVectorStore;