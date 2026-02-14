
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {

    const decoded = jwt.verify(token, ENV.JWT_SECRET );
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
