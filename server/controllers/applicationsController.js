import userModel from "../models/userModel.js";

export const getAllApplications = async (req, res)=>{
    
try {
    const students = await userModel
      .find({ role: "student" }) 
      .sort({ createdAt: -1 })   // latest first

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

    console.log(students)
    console.log("Applications controller hit ")

    } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications"
    });
  }
    
}