import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

// Use memory storage so we can pass the buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;

    // Upload to Cloudinary using upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "cyman_products" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        return res.json({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    uploadStream.end(fileBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;