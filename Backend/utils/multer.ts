import multer from "multer";

const vedioStorage = multer.memoryStorage();

export const uploadVideo = multer({
  storage: vedioStorage,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only videos are allowed!"));
    }
  },
});
