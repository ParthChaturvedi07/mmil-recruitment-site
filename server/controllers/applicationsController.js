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
    const {
      technicalStatus,
      hrStatus,
      hosteler,
      minScore,
      year,
      branch,
      search,
    } = req.query;

    let query = {
      role: "student",
      department: domain,
    };

    if (technicalStatus && technicalStatus !== "all") {
      query.technicalStatus = technicalStatus;
    }

    if (hrStatus && hrStatus !== "all") {
      query.hrStatus = hrStatus;
    }

    if (hosteler !== undefined && hosteler !== "all") {
      query.hosteler = hosteler === "true";
    }

    if (minScore) {
      query.score = { $gte: Number(minScore) };
    }

    if (year && year !== "all") {
      query.year = year;
    }

    if (branch && branch !== "all") {
      query.branch = { $regex: branch, $options: "i" };
    }

    if (req.query.hasResume === "true") {
      query.resume = { $exists: true, $ne: null };
    }


    if (search) {
      const escapedSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
        { admissionNumber: { $regex: escapedSearch, $options: "i" } },
        { universityRoll: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const students = await userModel.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "resumes",
          localField: "_id",
          foreignField: "uploadedBy",
          as: "resumeDoc",
        },
      },
      {
        $addFields: {
          resumeId: { $arrayElemAt: ["$resumeDoc._id", 0] },
        },
      },
      {
        $project: {
          passwordHash: 0,
          googleId: 0,
          __v: 0,
          resumeDoc: 0,
        },
      },
    ]);

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const {
      search,
      department,
      technicalStatus,
      hrStatus,
      hosteler,
      minScore,
      year,
      branch,
    } = req.query;

    let query = { role: "student" };

    if (department && department !== "all") {
      query.department = department;
    }

    if (technicalStatus && technicalStatus !== "all") {
      query.technicalStatus = technicalStatus;
    }

    if (hrStatus && hrStatus !== "all") {
      query.hrStatus = hrStatus;
    }

    if (hosteler !== undefined && hosteler !== "all") {
      query.hosteler = hosteler === "true";
    }

    if (minScore) {
      query.score = { $gte: Number(minScore) };
    }

    if (year && year !== "all") {
      query.year = year;
    }

    if (branch && branch !== "all") {
      query.branch = { $regex: branch, $options: "i" };
    }

    if (req.query.hasResume === "true") {
      query.resume = { $exists: true, $ne: null };
    }


    if (search) {
      const escapedSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
        { admissionNumber: { $regex: escapedSearch, $options: "i" } },
        { universityRoll: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const students = await userModel.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "resumes",
          localField: "_id",
          foreignField: "uploadedBy",
          as: "resumeDoc",
        },
      },
      {
        $addFields: {
          resumeId: { $arrayElemAt: ["$resumeDoc._id", 0] },
        },
      },
      {
        $project: {
          passwordHash: 0,
          googleId: 0,
          __v: 0,
          resumeDoc: 0,
        },
      },
    ]);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      aptitudeStatus,
      technicalStatus,
      hrStatus,
      score,
      technicalScore,
      problemSolvingScore,
      communicationScore,
      confidenceScore,
      commitmentScore,
      hosteler,
      comment
    } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        ...(aptitudeStatus && { aptitudeStatus }),
        ...(technicalStatus && { technicalStatus }),
        ...(hrStatus && { hrStatus }),
        ...(score !== undefined && { score }),
        ...(technicalScore !== undefined && { technicalScore }),
        ...(problemSolvingScore !== undefined && { problemSolvingScore }),
        ...(communicationScore !== undefined && { communicationScore }),
        ...(confidenceScore !== undefined && { confidenceScore }),
        ...(commitmentScore !== undefined && { commitmentScore }),
        ...(hosteler !== undefined && { hosteler }),
        ...(comment !== undefined && { comment })
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
