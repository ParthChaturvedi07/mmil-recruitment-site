import technicalModel from "../models/technicalModel.js";

const technicalMiddleware = async (req, res, next) => {
  const { githubLink, projectLink } = req.body;

  if (!githubLink || !projectLink) {
    return res
      .status(400)
      .json({ message: "Both GitHub link and project link are required" });
  }

  const urlRegex = /^(https?:\/\/[^\s]+)$/;
  if (!urlRegex.test(githubLink) || !urlRegex.test(projectLink)) {
    return res
      .status(400)
      .json({
        message: "Please provide valid URLs for GitHub and project links",
      });
  }

  try {
    const existing = await technicalModel.findOne({ userId: req.user.id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already submitted a technical project" });
    }

    next();
  } catch (err) {
    console.error("Error in technicalMiddleware:", err);
    res
      .status(500)
      .json({ message: "Error validating technical project submission" });
  }
};

export default technicalMiddleware;
