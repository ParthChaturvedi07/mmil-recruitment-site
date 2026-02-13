import userModel from "../models/userModel.js";

// 🔹 Get All Applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Applications By Department
export const getApplicationsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const applications = await Application.find({ department });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
