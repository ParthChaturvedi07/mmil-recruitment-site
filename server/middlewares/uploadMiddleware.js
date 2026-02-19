import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.resolve("uploads/");
    console.log("Multer saving to:", dest);
    // Ensure directory exists
    import("fs").then(fs => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
    });
    cb(null, "uploads/"); // inside server folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

export default upload;
