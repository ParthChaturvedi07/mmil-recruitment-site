import webDevModel from "../models/webDevModel.js";


const submitWebDevProject = async (req, res) => {
  try {
    const { phoneNumber, hostedSiteLink, githubRepoLink } = req.body;

    if (!phoneNumber || !hostedSiteLink || !githubRepoLink) {
      return res.status(400).json({ message: "Phone number, hosted site link and GitHub repo link are required" });
    }

    // Save project
    const project = await webDevModel.create({
      userId: req.user.id,
      phoneNumber,
      hostedSiteLink,
      githubRepoLink
    });

    res.json({
      success: true,
      message: "Project submitted successfully",
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to submit project",
    });
  }
};


const getMyProject = async (req, res) => {
  try {
    const project = await webDevModel.findOne({ userId: req.user.id });

    if (!project) {
      return res.status(404).json({ message: "No project found for this user" });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};


const getAllProjects = async (req, res) => {
  try {
    const projects = await webDevModel.find().populate("userId", "name email");

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all projects",
    });
  }
};

export { submitWebDevProject, getMyProject, getAllProjects };
