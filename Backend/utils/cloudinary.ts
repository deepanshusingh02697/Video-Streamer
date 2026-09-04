import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadVideoToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
  cloudinary.uploader.upload_chunked_stream(
    { resource_type: "video", folder: "VedioStreamer", chunk_size: 5 * 1024 * 1024 },
    (error, result) => error ? reject(error) : resolve(result?.secure_url as string)
  ).end(buffer);
});
};
