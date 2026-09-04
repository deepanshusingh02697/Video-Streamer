import express, { Request, Response, NextFunction } from "express";
import { uploadVideo } from "../utils/multer";
import { uploadVideoToCloudinary } from "../utils/cloudinary";
import { verifyaccessToken } from "../lib/jwt.cookie";

const router = express.Router();

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    verifyaccessToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

router.post(
  "/video",
  requireAuth,
  uploadVideo.single("videoStream"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No video file provided" });
      }
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
  },
);

export default router;
