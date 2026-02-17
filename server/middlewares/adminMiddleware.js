import userModel from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default adminMiddleware;
