import express from "express";
import { uploadVideo } from "../utils/multer";
import { uploadVideoToCloudinary } from "../utils/cloudinary";

const router = express.Router();

router.post("/video", uploadVideo.single("videoStream"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No video file provided" });
    }
    console.log("file buffer : ",file);
    const url = await uploadVideoToCloudinary(file.buffer);
    return res.status(200).json({
      message: "Video uploaded successfully",
      url,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Video upload error:", error);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
});

export default router;
