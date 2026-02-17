import technicalModel from '../models/technicalModel.js';


const submitTechnicalProject = async (req, res) => {
  try {
    const { githubLink, projectLink } = req.body;

    if (!githubLink || !projectLink) {
      return res.status(400).json({ message: "Both GitHub link and project link are required." });
    }

    const newProject = await technicalModel.create({
      githubLink,
      projectLink,
    });

    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error("Error adding project:", err);
    res.status(500).json({ message: "Failed to add project" });
  }
};


const getTechnicalProjects = async (req, res) => {
  try {
    const projects = await technicalModel.find();
    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export { submitTechnicalProject, getTechnicalProjects };
