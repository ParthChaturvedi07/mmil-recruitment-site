// check-models.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./config/env.js"; // Make sure this path is right for your key

async function listModels() {
  const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  
  try {
    console.log("Checking available models...");
    const modelList = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; // Just to trigger init
    
    // There isn't a direct "list models" in the simplified SDK helper, 
    // so we use the fetch directly to debug the account permissions:
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${ENV.GEMINI_API_KEY}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error);
      return;
    }

    console.log("✅ Available Embedding Models:");
    const embeddingModels = data.models
      .filter(m => m.name.includes("embedding"))
      .map(m => m.name);
    
    console.log(embeddingModels);

  } catch (error) {
    console.error("❌ Network/Script Error:", error);
  }
}

listModels();