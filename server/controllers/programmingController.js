import programmingModel from "../models/programmingModel.js";

const submitProgrammingProject = async (req, res) => {
    try {
        const { phoneNumber, hackerRankUsername } = req.body;

        if (!phoneNumber || !hackerRankUsername) {
            return res.status(400).json({ message: "Phone Number and HackerRank Username are required." });
        }

        const newProgramming = await programmingModel.create({
            userId: req.user._id || req.user.id,
            phoneNumber,
            hackerRankUsername,
        });

        res.status(201).json({ success: true, project: newProgramming });
    } catch (err) {
        console.error("Error submitting programming project:", err);
        res.status(500).json({ message: "Failed to submit programming project" });
    }
};

export { submitProgrammingProject };
