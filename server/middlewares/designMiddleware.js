import designModel from "../models/designModel.js";

const designMiddleware = async (req, res, next) => {
  const { figmaLink, githubLink } = req.body;

  if (!figmaLink) {
    return res.status(400).json({ message: "Figma link is required" });
  }

  // Optional: simple URL validation
  const urlRegex = /^(https?:\/\/[^\s]+)$/;
  if (!urlRegex.test(figmaLink) || (githubLink && !urlRegex.test(githubLink))) {
    return res.status(400).json({ message: "Please provide valid URLs for Figma and GitHub links" });
  }

  try {
    // Optional: prevent multiple submissions from same user
    const existing = await designModel.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "You have already submitted a design project" });
    }

    next();
  } catch {
    res.status(500).json({ message: "Error validating design project submission" });
  }
};

export default designMiddleware;
