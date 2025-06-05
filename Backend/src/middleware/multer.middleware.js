import multer from "multer";

const storage = multer.memoryStorage();

const avatarUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type"));
  },
  limits: { fileSize: 30 * 1024 * 1024 }, // 1MB only
});

export default avatarUpload;
