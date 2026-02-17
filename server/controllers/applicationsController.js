import userModel from '../models/userModel.js';

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getStats = async (req, res) => {
  try {
    const totalStudents = await userModel.countDocuments({ role: "student" });

    const domainStats = await userModel.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    res.json({
      totalStudents,
      domainStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentsByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    const students = await userModel.find({
      role: "student",
      department: domain
    }).select('-passwordHash -googleId -__v');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { search, department } = req.query;
    let query = { role: "student" };

    if (department && department !== "all") {
      query.department = department;
    }

    if (search) {
      const escapedSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
        { admissionNumber: { $regex: escapedSearch, $options: "i" } },
        { universityRoll: { $regex: escapedSearch, $options: "i" } }
      ];
    }

    const students = await userModel.find(query)
      .select('-passwordHash -googleId -__v')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { aptitudeStatus, technicalStatus, hrStatus, score } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { 
        ...(aptitudeStatus && { aptitudeStatus }),
        ...(technicalStatus && { technicalStatus }),
        ...(hrStatus && { hrStatus }),
        ...(score !== undefined && { score }),
      },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Emit real-time update
    try {
      const { emitAdminUpdate } = await import("../utils/socket.js");
      emitAdminUpdate({ userId: id, type: "status_updated", status: { aptitudeStatus, technicalStatus, hrStatus } });
    } catch (socketErr) {
      console.error("Socket emission failed:", socketErr.message);
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
