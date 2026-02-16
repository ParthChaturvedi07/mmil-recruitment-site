// check-chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./config/env.js"; // Ensure this path is correct

async function listChatModels() {
  console.log("🔍 Checking available Chat models...");
  
  try {
    // We fetch the raw list from Google's API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${ENV.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log("\n✅ YOUR AVAILABLE CHAT MODELS:");
    console.log("---------------------------------");
    
    const chatModels = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name); // This gives us the EXACT string ID

    if (chatModels.length === 0) {
      console.log("❌ No chat models found! Your API Key might be invalid or restricted.");
    } else {
      chatModels.forEach(name => console.log(`"${name.replace('models/', '')}"`));
    }
    console.log("---------------------------------");
    console.log("👉 Copy one of the names above exactly into your code.");

  } catch (error) {
    console.error("❌ Error checking models:", error.message);
  }
}

listChatModels();