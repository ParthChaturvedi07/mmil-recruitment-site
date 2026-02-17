import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ENV } from "../config/env.js";
import { keyManager } from "../utils/keyManager.js";
import { getSession, addMessage } from "../utils/chatMemory.js";
import userModel from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const chatbotRouter = express.Router();

const getMissingFields = (user) => {
  const missingFields = [];
  if (!user.year) missingFields.push("year");
  if (!user.branch) missingFields.push("branch");
  if (!user.department) missingFields.push("department");
  if (!user.admissionNumber) missingFields.push("admissionNumber");
  // Defensive: If roll no is present but not strictly numeric, treat as missing so bot asks again
  if (!user.universityRoll || !/^\d+$/.test(user.universityRoll)) missingFields.push("universityRoll");
  if (!user.phone) missingFields.push("phone");

  if (user.department === "designing") {
    if (!user.links?.figma && !user.links?.behance) missingFields.push("designPortfolio");
  } else {
    if (!user.links?.github) missingFields.push("github");
  }

  if (user.year === "2" && !user.resume) missingFields.push("resume");
  return missingFields;
};

const getQuestionForField = (field, userName) => {
  switch (field) {
    case "year":
      return `Which year are you in (1st or 2nd)?`;
    case "branch":
      return "Awesome. What’s your branch? (CSE, IT, ECE, etc.)";
    case "department":
      return "Which department would you like to apply for? (Technical, WebDev, Programming, Designing)";
    case "admissionNumber":
      return "Could you share your admission number? (Example: 24cseaiml043) (or type 'none' if you are not an AKTU student)";
    case "universityRoll":
      return "Great—now please enter your university roll number (8–17 digits) (for both uni and AKTU).";
    case "phone":
      return "Now, for contact—please share your phone number (10 digits).";
    case "github":
      return "Please share your GitHub profile link (for example: https://github.com/your-username) or type 'none'.";
    case "designPortfolio":
      return "Please share either your Figma OR Behance link (or type 'none').";
    case "figma":
      return "Please share your Figma profile link or type 'none'.";
    case "behance":
      return "Please share your Behance profile link or type 'none'.";
    case "resume":
      return "Please upload your resume (PDF).";
    default:
      return "Can you share the next detail for your profile?";
  }
};

const validateForField = (field, message, user) => {
  const v = String(message || "").trim();
  const vLower = v.toLowerCase();

  if (field === "branch") {
    const validBranches = ["cse", "cse-aiml", "cseaiml", "aiml", "it", "ece", "ee", "civil", "me", "che", "csds", "cs-ds", "cseds", "cse-ds"];
    const branchPattern = new RegExp(`\\b(${validBranches.join("|")})\\b`, "i");
    const match = vLower.match(branchPattern);
    if (!match) {
      return { field: "branch", message: "Please enter a valid branch (CSE, IT, ECE, EE, Civil, ME, CHE, CSE-AIML, CSE-DS)." };
    }
  }

  if (field === "year") {
    const yearMatch = vLower.match(/\b(1|2|first|second|one|two|1st|2nd)\b/);
    if (!yearMatch) {
      return { field: "year", message: "Please enter a valid year (1st or 2nd year only)." };
    }
  }

  if (field === "phone") {
    const phoneMatch = v.match(/\b\d{10}\b/);
    if (!phoneMatch) {
      return { field: "phone", message: "Please enter a valid 10-digit phone number." };
    }
  }

  if (field === "universityRoll") {
    // Strictly numeric
    const uniMatch = v.match(/\b\d{8,17}\b/);
    if (!uniMatch) {
      return { field: "universityRoll", message: "Please enter a valid university roll number (8–17 digits)." };
    }
  }

  if (field === "admissionNumber") {
    if (vLower === "none") return null;
    const fullPattern = /\b\d{2}[a-z]{2,8}\d{3}\b/i;
    if (!fullPattern.test(v)) {
      return { field: "admissionNumber", message: "Please enter a valid admission number (example: 24cseaiml043) or type 'none'." };
    }
  }

  if (field === "department") {
    const msgLower = v.toLowerCase();
    const ok = /(technical|webdev|programming|designing|web development|design)/i.test(msgLower);
    if (!ok) {
      return { field: "department", message: "Please choose a valid department: Technical, WebDev, Programming, or Designing." };
    }
  }

  if (field === "designPortfolio") {
    if (vLower === "none") return null;
    const isFigma = /figma\.com\//i.test(v);
    const isBehance = /behance\.net\//i.test(v);
    if (!isFigma && !isBehance) {
      return { field: "designPortfolio", message: "Please enter a valid Figma or Behance link (or type 'none')." };
    }
  }

  if (field === "github") {
    if (vLower === "none") return null;
    if (!/github\.com\/[\w\-]+/i.test(v)) {
      return { field: "github", message: "Please enter a valid GitHub profile link (example: https://github.com/your-username)." };
    }
  }

  if (field === "figma") {
    if (vLower === "none") return null;
    if (!/figma\.com\//i.test(v)) {
      return { field: "figma", message: "Please enter a valid Figma link." };
    }
  }

  if (field === "behance") {
    if (vLower === "none") return null;
    if (!/behance\.net\//i.test(v)) {
      return { field: "behance", message: "Please enter a valid Behance link." };
    }
  }

  return null;
};

const buildOnboardingReply = (user, updatedFields) => {
  const missing = getMissingFields(user);
  if (missing.length === 0) {
    return `Perfect, ${user.name}! Your profile is complete. 🎉 If you have any questions about MMIL, ask me anytime.`;
  }

  const nextField = missing[0];
  const nextQuestion = getQuestionForField(nextField, user.name);
  const ack = Array.isArray(updatedFields) && updatedFields.length > 0
    ? `Got it — saved: ${updatedFields.join(", ")}. `
    : "";
  return `${ack}${nextQuestion}`.trim();
};

// --- SMART EXTRACTION LOGIC ---
const extractUserInfo = (message, user) => {
  const info = {};
  const msgLower = message.toLowerCase();

  // 1. EXTRACT YEAR
  // Accepts: "1", "2", "1st", "first", "first year", etc.
  if (!user.year) {
    const yearMap = {
      '1': '1', 'first': '1', 'one': '1', '1st': '1',
      '2': '2', 'second': '2', 'two': '2', '2nd': '2'
    };
    // Look for these words as whole words
    const yearMatch = msgLower.match(/\b(1|2|first|second|one|two|1st|2nd)\b/);
    if (yearMatch) {
      info.year = yearMap[yearMatch[1]];
    }
  }

  // 2. EXTRACT BRANCH
  // Accepts: "CSE", "CSE-AIML", "AIML", "IT", etc.
  if (!user.branch) {
    const validBranches = ['cse', 'cse-aiml', 'cseaiml', 'aiml', 'it', 'ece', 'ee', 'civil', 'me', 'che', 'csds', 'cs-ds', 'cseds', 'cse-ds'];
    const branchPattern = new RegExp(`\\b(${validBranches.join('|')})\\b`, 'i');
    const branchMatch = msgLower.match(branchPattern);

    if (branchMatch) {
      let rawBranch = branchMatch[1].toUpperCase();
      // Normalize variations
      if (rawBranch === 'AIML' || rawBranch === 'CSEAIML') rawBranch = 'CSE-AIML';
      if (['CSDS', 'CS-DS', 'CSEDS'].includes(rawBranch)) rawBranch = 'CSE-DS';
      info.branch = rawBranch;
    }
  }

  // 3. EXTRACT ADMISSION NUMBER (Smart & Flexible)
  // Strategy A: Full Format (e.g., "24cseaiml043")
  // Strategy B: Partial Format (e.g., "043" or "43") if we already know Year & Branch
  if (!user.admissionNumber) {
    // Check for full format first
    // \d{2} = Year, [a-z]{2,8} = Branch (flexible length), \d{3} = Roll
    const fullPattern = /\b(\d{2}[a-z]{2,8}\d{3})\b/i;
    const fullMatch = msgLower.match(fullPattern);

    if (fullMatch) {
      info.admissionNumber = fullMatch[1];
    }
    // If no full match, try extracting just the roll number (Strategy B)
    else if (user.year && user.branch) {
      // Look for a standalone 2 or 3 digit number (e.g. "43", "043")
      // \b ensures we don't match inside a phone number
      const shortPattern = /\b(\d{2,3})\b/;
      const shortMatch = msgLower.match(shortPattern);

      if (shortMatch) {
        let rollDigits = shortMatch[1];
        // Pad with zero if length is 2 (e.g. "43" -> "043")
        if (rollDigits.length === 2) rollDigits = "0" + rollDigits;

        // Construct the full ID
        // Calculate Batch Prefix: Current Year (25) - (Year of Study - 1)
        // Example: 1st year in 2025 -> Batch 24. 2nd year -> Batch 23.
        const currentBatchYear = 25; // Change this based on current academic year logic
        const yearPrefix = (currentBatchYear - (parseInt(user.year) - 1)).toString();

        // Clean branch string for ID (remove spaces/symbols)
        const cleanBranch = user.branch.toLowerCase().replace(/[^a-z]/g, '');

        info.admissionNumber = `${yearPrefix}${cleanBranch}${rollDigits}`;
      }
    }
  }

  // 4. EXTRACT UNIVERSITY ROLL (Strictly numeric 8-17 chars)
  if (!user.universityRoll) {
    const uniRollPattern = /\b(\d{8,17})\b/;
    const uniMatch = message.match(uniRollPattern);
    if (uniMatch) {
      // Additional check to avoid confusing with phone numbers if it's purely numeric and 10 digits
      // But requirement says 8-17. Phone is 10.
      // If it looks like a phone number (10 digits), we might prefer to treat it as phone if phone is missing?
      // For now, if we are prompting for universityRoll, we prioritize that.
      // The extraction logic runs on every message.

      // Let's refine: If we find something that matches uni roll pattern
      // We should be careful not to capture simple words.
      // 8-17 characters is quite broad. "Programming" is 11 chars. "Department" is 10.
      // We need to be stricter. Maybe require at least one number? 
      // The requirement says "combination of number and words".
      // But typically roll numbers *might* be just numbers too?
      // "change it format to combination of number and words" -> implies mixed.
      // But "filled with only for aktu students" was for admission no.
      // "university roll number change it format to combination of number and words and warry from 8-17"

      // Let's stick to the requested validation but maybe be careful about extraction from free text.
      // If the user answers the specific question, the validation logic (`validateForField`) handles it more specifically.
      // `extractUserInfo` tries to guess fields from random text.
      // Updating this to be too broad might cause false positives.
      // For now, I will use a pattern that looks for mixed alphanumeric OR long numeric strings, avoiding common words if possible.
      // Actually, simplest compliance is just matching the length range.

      info.universityRoll = uniMatch[1];
    }
  }

  // 5. EXTRACT PHONE NUMBER
  // Exactly 10 digits. Must not be the same as uni roll or admission number.
  if (!user.phone) {
    const phonePattern = /\b(\d{10})\b/;
    const phoneMatch = message.match(phonePattern);
    if (phoneMatch) {
      const foundNumber = phoneMatch[1];
      // Safety check: is this number already used as the University Roll?
      const isNotUni = (!info.universityRoll && user.universityRoll !== foundNumber);
      if (isNotUni) {
        info.phone = foundNumber;
      }
    }
  }

  // 6. EXTRACT DEPARTMENT
  if (!user.department) {
    const deptPattern = /\b(technical|webdev|programming|designing|web development|design)\b/i;
    const deptMatch = msgLower.match(deptPattern);
    if (deptMatch) {
      const raw = String(deptMatch[1] || "").toLowerCase();
      if (raw === "web development") info.department = "webdev";
      else if (raw === "design") info.department = "designing";
      else info.department = raw;
    }
  }

  // 7. EXTRACT LINKS
  if (!user.links?.github) {
    const match = message.match(/github\.com\/[\w\-]+/i);
    if (match) info.github = "https://" + match[0];
  }
  if (!user.links?.figma) {
    const match = message.match(/figma\.com\/[\w\-]+/i);
    if (match) info.figma = "https://" + match[0];
  }
  if (!user.links?.behance) {
    const match = message.match(/behance\.net\/[\w\-]+/i);
    if (match) info.behance = "https://" + match[0];
  }

  return info;
};

// --- SYSTEM PROMPT ---
const getSystemPrompt = (user, isFirstTurn) => {
  const missingFields = getMissingFields(user);
  const isComplete = missingFields.length === 0;
  const nextField = missingFields[0];
  const nextQuestion = nextField ? getQuestionForField(nextField, user.name) : "";

  return `
You are MMIL Recruitment Assistant - a friendly and professional AI recruiter.

CURRENT USER STATUS:
- Name: ${user.name}
- Profile Complete: ${isComplete ? "Yes" : "No"}

YOUR GOAL:
1. Start with a warm greeting if this is the beginning.
2. Ask for only ONE missing item at a time.
3. If the user gives wrong/invalid data, politely ask them to enter the correct value.
4. If the profile is complete, answer questions about MMIL using the knowledge base.

START OF CHAT:
${isFirstTurn ? `Greet the user and say: "Welcome to MMIL recruitments 👋, ${user.name}! Let's start with your profile completion."` : ""}

NEXT STEP:
${nextField ? `Ask this next (and only this): ${nextQuestion}` : "If complete: congratulate them and offer help."}

STYLE:
- Interactive and encouraging.
- Short messages.
`;
};

// --- CHAT ROUTE ---
chatbotRouter.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID required" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const history = getSession(userId);
    const isFirstTurn = history.length === 0;
    addMessage(userId, "user", message);

    const missingBefore = getMissingFields(user);
    const nextExpectedField = missingBefore[0];
    const validationErrors = [];

    if (isFirstTurn) {
      const nextQuestion = nextExpectedField ? getQuestionForField(nextExpectedField, user.name) : "";
      const reply = nextQuestion
        ? `Welcome to MMIL recruitments 👋, ${user.name}! Let's start with your profile completion. ${nextQuestion}`
        : `Welcome to MMIL recruitments 👋, ${user.name}! Your profile is already complete. 🎉 How can I help you today?`;

      addMessage(userId, "assistant", reply);
      return res.json({
        reply,
        profileComplete: !nextQuestion,
        updatedFields: [],
        validationErrors: [],
      });
    }

    if (nextExpectedField && nextExpectedField !== "resume") {
      const errObj = validateForField(nextExpectedField, message, user);
      if (errObj) validationErrors.push(errObj);
    }

    if (validationErrors.length > 0) {
      const reply = validationErrors[0].message;
      addMessage(userId, "assistant", reply);
      return res.json({
        reply,
        profileComplete: false,
        updatedFields: [],
        validationErrors,
      });
    }

    // 2. Extract Data (The "Smart" Step)
    const messageLower = String(message || "").trim().toLowerCase();
    const extractedInfo = extractUserInfo(message, user);

    if (messageLower === "none") {
      if (nextExpectedField === "github") extractedInfo.github = "none";
      if (nextExpectedField === "figma") extractedInfo.figma = "none";
      if (nextExpectedField === "behance") extractedInfo.behance = "none";
      if (nextExpectedField === "designPortfolio") extractedInfo.figma = "none";
      if (nextExpectedField === "admissionNumber") extractedInfo.admissionNumber = "none";
    }
    let updatedFields = [];

    // Helper to update fields
    const updateField = (field, value, logName) => {
      // Only update if value exists and is different/new
      if (value) {
        if (field === 'links') {
          if (!user.links) user.links = {};
          // Handle links separately if needed, simplified here:
          if (value.github && !user.links.github) { user.links.github = value.github; updatedFields.push("github"); }
          if (value.figma && !user.links.figma) { user.links.figma = value.figma; updatedFields.push("figma"); }
          if (value.behance && !user.links.behance) { user.links.behance = value.behance; updatedFields.push("behance"); }
        } else {
          user[field] = value;
          updatedFields.push(logName);
        }
      }
    };

    updateField('year', extractedInfo.year, "Year");
    updateField('branch', extractedInfo.branch, "Branch");
    updateField('department', extractedInfo.department, "Department");
    updateField('admissionNumber', extractedInfo.admissionNumber, "Admission Number");
    updateField('universityRoll', extractedInfo.universityRoll, "University Roll");
    updateField('phone', extractedInfo.phone, "Phone");
    updateField('links', {
      github: extractedInfo.github,
      figma: extractedInfo.figma,
      behance: extractedInfo.behance
    }, "Links");

    if (updatedFields.length > 0) {
      try {
        await user.save();
        // Notify admin of update
        const { emitAdminUpdate } = await import("../utils/socket.js");
        emitAdminUpdate({ userId: user._id, type: "profile_updated", updatedFields });
      } catch (saveErr) {
        if (saveErr?.name === "ValidationError") {
          const validationErrors = Object.keys(saveErr.errors || {}).map((field) => ({
            field,
            message: saveErr.errors[field]?.message || `Invalid value for ${field}`,
          }));

          const reply = validationErrors[0]?.message || "Please enter correct details";
          addMessage(userId, "assistant", reply);
          return res.status(400).json({
            reply,
            profileComplete: false,
            updatedFields: [],
            validationErrors,
          });
        }
        throw saveErr;
      }
    }

    const isCompleteNow = getMissingFields(user).length === 0;
    if (!isCompleteNow) {
      const reply = buildOnboardingReply(user, updatedFields);
      addMessage(userId, "assistant", reply);
      return res.json({
        reply,
        profileComplete: false,
        updatedFields,
        validationErrors: [],
      });
    }

    // 3. Validation Feedback (Only if extraction FAILED but user TRIED)
    let validationFeedback = "";

    // Example: User provided a number for phone, but it wasn't 10 digits
    if (!user.phone && !extractedInfo.phone) {
      // If message contains digits but not 10 of them
      if (/\d+/.test(message) && !/\d{10}/.test(message) && !user.admissionNumber) {
        // Only complain if we aren't looking for admission number/roll no
        if (user.admissionNumber && user.universityRoll) {
          validationFeedback = "That looks like a number, but for a phone number, I need exactly 10 digits.";
        }
      }
    }

    // 4. Vector Search (RAG)
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: keyManager.getApiKey(),
      model: "gemini-embedding-001",
    });

    let context = "";
    try {
      const vectorStore = await HNSWLib.load("./vectorstore", embeddings);
      const docs = await vectorStore.similaritySearch(message, 3); // Reduced to 3 for speed
      context = docs.map(d => d.pageContent).join("\n");
    } catch (e) {
      console.warn("Vector store not loaded/found, continuing without context.");
    }

    // 5. Construct Prompt
    // Key: We tell the AI what we JUST updated so it doesn't ask again immediately.
    const systemPrompt = getSystemPrompt(user, isFirstTurn);
    const prompt = `${systemPrompt}

KNOWLEDGE BASE:
${context}

CONVERSATION HISTORY:
${history.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).slice(-6).join("\n")}

USER MESSAGE:
${message}

SYSTEM UPDATE:
${updatedFields.length > 0 ? `SUCCESS: Extracted and saved: ${updatedFields.join(', ')}.` : ''}
${validationFeedback ? `NOTE: ${validationFeedback}` : ''}

Respond to the user naturally. If data was just saved, acknowledge it and move to the next step.`;

    // 6. Generate Response (with fallback so chat never hard-fails)
    let text = "";
    try {
      const modelName = ENV.GEMINI_MODEL || "gemini-3-flash";

      // Execute with retry logic using KeyManager
      const result = await keyManager.executeWithRetry(async (apiKey) => {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        return await model.generateContent(prompt);
      });

      text = result.response.text();
    } catch (aiErr) {
      console.error("Gemini generateContent error:", aiErr?.message || aiErr);

      // If we already detected a validation note, use that.
      if (validationFeedback) {
        text = validationFeedback;
      } else {
        // Deterministic fallback onboarding question based on missing fields.
        const missing = [];
        if (!user.year) missing.push("year");
        if (!user.branch) missing.push("branch");
        if (!user.department) missing.push("department");
        if (!user.admissionNumber) missing.push("admission number");
        if (!user.universityRoll) missing.push("university roll number");
        if (!user.phone) missing.push("phone number");

        if (!user.links) user.links = {};
        if (user.department === "designing") {
          if (!user.links.figma && !user.links.behance) missing.push("portfolio link (Figma or Behance)");
        } else {
          if (!user.links.github) missing.push("github link");
        }
        if (user.year === "2" && !user.resume) missing.push("resume");

        const next = missing[0];
        if (!next) {
          text = "Your profile is complete. 🎉";
        } else if (next === "department") {
          text = "Which department would you like to apply for? (Technical, WebDev, Programming, Designing)";
        } else if (next === "resume") {
          text = "Please upload your resume.";
        } else {
          text = `Please share your ${next}.`;
        }
      }
    }

    addMessage(userId, "assistant", text);

    // 7. Check Completion
    const isComplete = getMissingFields(user).length === 0;

    if (isComplete && !user.isProfileComplete) {
      user.isProfileComplete = true;
      await user.save();
    }

    res.json({
      reply: text,
      profileComplete: isComplete,
      updatedFields: updatedFields,
      validationErrors: []
    });

  } catch (err) {
    console.error("Chatbot error:", err);
    console.error("Error details:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Chatbot failed", details: err.message });
  }
});

// --- TEST USER ENDPOINT ---
chatbotRouter.post("/create-test-user", async (req, res) => {
  try {
    const testUser = await userModel.create({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      googleId: `test${Date.now()}`,
      isProfileComplete: false
    });

    res.json({
      userId: testUser._id,
      email: testUser.email,
      message: "Test user created successfully"
    });
  } catch (err) {
    console.error("Test user creation error:", err);
    res.status(500).json({ error: "Failed to create test user" });
  }
});

// --- RESUME UPLOAD ROUTE (Unchanged) ---
chatbotRouter.post("/upload-resume", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { resume: req.file?.path }, // Just update path
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if everything else is done
    // Check if everything else is done
    const isComplete = getMissingFields(user).length === 0;

    if (isComplete) {
      user.isProfileComplete = true;
      await user.save();
    }

    addMessage(userId, "user", "📄 Resume uploaded");
    const reply = "Perfect! Received your resume. " + (isComplete ? "Your profile is now complete! 🎉" : "What is the next detail?");
    addMessage(userId, "assistant", reply);

    res.json({
      message: "Resume uploaded successfully",
      profileComplete: !!isComplete,
      reply: reply
    });

  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ error: "Resume upload failed" });
  }
});

export default chatbotRouter;

