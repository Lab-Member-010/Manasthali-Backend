import multer from "multer";
import path from "path";

// Configure multer storage for file uploads.
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (request, file, callback) {
    console.log(file);
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Export multer upload configuration.
const upload = multer({ storage });

export default upload;
