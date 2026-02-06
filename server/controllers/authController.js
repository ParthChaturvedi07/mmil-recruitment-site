import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js'
import { ENV } from '../config/env.js'

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);
 const googleAuth = async (req, res) => {
    try {
        const { token } = req.body

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: ENV.GOOGLE_CLIENT_ID
        })

        const { name, email, sub } = ticket.getPayload()
        let user = await userModel.findOne({ googleId: sub })
        if (!user) {
            user = await userModel.create({
                name,
                email,
                googleId: sub
            })
        }

        const appToken = jwt.sign({
            id: user._id, role: user.role
        },
            ENV.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ success: true, token: appToken, user, needsProfile: !user.isProfileComplete })
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" })
    }
}

// profile complete 

 const completeProfile = async (req, res) => {
  try {
    const { department, phone, branch } = req.body;
    const links = JSON.parse(req.body.links);
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        department,
        phone,
        branch,
        links,
        resume: req.file?.path,
        isProfileComplete: true
      },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

export {googleAuth, completeProfile}