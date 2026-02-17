import technicalModel from '../models/technicalModel.js';


const submitTechnicalProject = async (req, res) => {
  try {
    const { phoneNumber, githubLink, projectLink } = req.body;

    if (!phoneNumber || !githubLink || !projectLink) {
      return res.status(400).json({ message: "Phone number, GitHub link, and project link are all required." });
    }

    const newProject = await technicalModel.create({
      userId: req.user.id,
      phoneNumber,
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
