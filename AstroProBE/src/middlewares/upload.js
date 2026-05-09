// middlewares/upload.js
import multer from "multer";
import sharp from "sharp";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

// Middleware to preprocess and normalize the image
export const preprocessPalm = async (req, res, next) => {
  if (!req.file) return next();

  try {
    req.processedImage = await sharp(req.file.buffer)
      .resize({ width: 1024, height: 1024, fit: "inside" }) // Normalize size
      .grayscale() // Converts to grayscale to make lines more distinct
      .normalize() // Enhances contrast dynamically
      .toFormat("jpeg", { quality: 85 })
      .toBuffer();

    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Image processing failed." });
  }
};
