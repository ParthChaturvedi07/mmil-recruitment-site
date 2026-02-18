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
        const { emitAdminUpdate } = await import("../utils/socket.js");
        emitAdminUpdate({ userId: user._id, type: "user_linked_google" });
      }
    } else {
      // SCENARIO B: New User. BLOCK THEM.
      return res.status(403).json({ message: "Registrations are currently closed." });
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
      return res.status(409).json({ message: "Account already exists. Please login with Google or your password." });
    }

    // SCENARIO 3: New User
    // BLOCK REGISTRATIONS
    return res.status(403).json({ message: "Registrations are currently closed." });

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

const checkAuthStatus = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      userId: user._id,
      isProfileComplete: user.isProfileComplete,
      needsProfile: !user.isProfileComplete
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  googleAuth,
  registerWithEmail,
  loginWithEmail,
  completeProfile,
  logout,
  checkAuthStatus
};
