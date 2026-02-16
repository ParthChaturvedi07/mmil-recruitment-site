import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { ENV } from "../config/env.js";

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

/* ---------------- TOKEN ---------------- */
const signAppToken = (user) => {
  return jwt.sign(
    { id: user._id },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ---------------- GOOGLE AUTH ---------------- */
/* ---------------- GOOGLE AUTH ---------------- */
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token missing" });

    // 1. Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: ENV.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub } = ticket.getPayload(); // 'sub' is the Google ID
    const normalizedEmail = String(email).trim().toLowerCase();

    // 2. Find User (by GoogleID OR Email)
    let user = await userModel.findOne({
      $or: [{ googleId: sub }, { email: normalizedEmail }]
    });

    if (user) {
      // SCENARIO A: User exists. 
      // Ensure GoogleID is linked (if they previously signed up with email only)
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    } else {
      // SCENARIO B: New User. Create them.
      user = await userModel.create({
        name,
        email: normalizedEmail,
        googleId: sub, // Here we DO provide googleId
        onboardingStep: 0,
        isProfileComplete: false
      });
    }

    // 3. Generate Token
    const appToken = signAppToken(user);

    res.json({
      token: appToken,
      userId: user._id,
      needsProfile: !user.isProfileComplete,
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};
// const googleAuth = async (req, res) => {
//   try {
//     const { token } = req.body;
//     if (!token) {
//       return res.status(400).json({ message: "Token missing" });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: ENV.GOOGLE_CLIENT_ID,
//     });

//     const { name, email, sub } = ticket.getPayload();
//     const normalizedEmail = String(email || "").trim().toLowerCase();

//     let user = await userModel.findOne({
//       $or: [{ googleId: sub }, { email: normalizedEmail }]
//     });

//     if (!user) {
//       user = await userModel.create({
//         name,
//         email: normalizedEmail,
//         googleId: sub,
//         onboardingStep: 0,
//         isProfileComplete: false
//       })
//     } else {
//       // Link googleId if user exists via email/password
//       if (!user.googleId) {
//         user.googleId = sub;
//       }
//       // Ensure email is normalized
//       if (normalizedEmail && user.email !== normalizedEmail) {
//         user.email = normalizedEmail;
//       }
//       await user.save();
//     }

//     const appToken = signAppToken(user);

//     res.json({
//       token: appToken,
//       userId: user._id,
//       needsProfile: !user.isProfileComplete,
//     });
//   } catch (error) {
//     console.error("Google Auth Error:", error);
//     res.status(401).json({ message: "Authentication failed" });
//   }
// };

/* ---------------- REGISTER WITH EMAIL ---------------- */
/* ---------------- REGISTER WITH EMAIL ---------------- */
const registerWithEmail = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await userModel.findOne({ email: normalizedEmail });

    if (user) {
      // SCENARIO 1: User exists and ALREADY has a password
      if (user.passwordHash) {
        return res.status(409).json({ message: "Email already registered. Please login." });
      }

      // SCENARIO 2: User exists via Google (no password), but wants to set a password now
      // This "Links" the accounts
      user.passwordHash = await bcrypt.hash(password, 10);
      if (name && !user.name) user.name = name; // Only update name if missing
      await user.save();

      const token = signAppToken(user);
      return res.status(200).json({
        token,
        userId: user._id,
        needsProfile: !user.isProfileComplete
      });
    }

    // SCENARIO 3: New User
    // CRITICAL: Do NOT pass "googleId: null" here. Just omit it.
    user = await userModel.create({
      name: name || "",
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      onboardingStep: 0,
      isProfileComplete: false,
    });

    const token = signAppToken(user);
    return res.status(201).json({
      token,
      userId: user._id,
      needsProfile: !user.isProfileComplete
    });

  } catch (err) {
    console.error("Register Error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ---------------- LOGIN WITH EMAIL ---------------- */
const loginWithEmail = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signAppToken(user);
    res.json({
      token,
      userId: user._id,
      needsProfile: !user.isProfileComplete,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ---------------- COMPLETE PROFILE ---------------- */
const completeProfile = async (req, res) => {
  try {
    const { department, phone, branch } = req.body;
    const links = req.body.links ? JSON.parse(req.body.links) : [];

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        department,
        phone,
        branch,
        links,
        resume: req.file?.path,
        isProfileComplete: true,
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

export {
  googleAuth,
  registerWithEmail,
  loginWithEmail,
  completeProfile,
  logout
};
