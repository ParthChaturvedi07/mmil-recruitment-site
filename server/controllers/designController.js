import designModel from "../models/designModel.js";

const addDesignProject = async (req, res) => {
  try {
    const { figmaLink, githubLink } = req.body;

    if (!figmaLink) {
      return res.status(400).json({ message: "Figma link is required." });
    }

    const newDesign = await designModel.create({
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
