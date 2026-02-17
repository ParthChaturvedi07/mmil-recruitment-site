import webDevModel from "../models/webDevModel.js";

const webDevMiddleware = async (req, res, next) => {
  const { hostedSiteLink, githubRepoLink } = req.body;

  if (!hostedSiteLink || !githubRepoLink) {
    return res
      .status(400)
      .json({ message: "Both hosted site link and GitHub repo link are required" });
  }

  
  const urlRegex = /^(https?:\/\/[^\s]+)$/;
  if (!urlRegex.test(hostedSiteLink) || !urlRegex.test(githubRepoLink)) {
    return res
      .status(400)
      .json({ message: "Please provide valid URLs for hosted site and GitHub repo" });
  }

  try {
   
    const existing = await webDevModel.findOne({ userId: req.user.id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already submitted a project" });
    }

    next(); 
  } catch (err) {
    res.status(500).json({ message: "Error validating project submission" });
  }
};

export default webDevMiddleware;
