import designModel from "../models/designModel.js";

const addDesignProject = async (req, res) => {
  try {
    const { phoneNumber, figmaLink, githubLink } = req.body;

    if (!phoneNumber || !figmaLink) {
      return res.status(400).json({ message: "Phone Number and Figma link are required." });
    }

    const newDesign = await designModel.create({
      userId: req.user.id,
      phoneNumber,
      figmaLink,
      githubLink,
    });

    res.status(201).json({ success: true, design: newDesign });
  } catch (err) {
    console.error("Error adding design project:", err);
    res.status(500).json({ message: "Failed to add design project" });
  }
};

const getDesignProjects = async (req, res) => {
  try {
    const designs = await designModel.find();
    res.status(200).json({ success: true, designs });
  } catch (err) {
    console.error("Error fetching design projects:", err);
    res.status(500).json({ message: "Failed to fetch design projects" });
  }
};

export { addDesignProject, getDesignProjects };
