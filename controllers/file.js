const { prisma } = require("../lib/prisma");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

function upload(folderName) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      const folderPath = `${folderName.trim()}`; // Update the folder path here
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;

      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
      };
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
  });
}

const show = async (req, res, next) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(req.params.fileId) },
    });
    if (!file) throw new Error("file doesn't exist!");
    res.render("files/show", { title: `file ${file.name}`, file: file });
  } catch (error) {
    next(error);
  }
};

const uploadGet = (req, res) => {
  res.render("files/upload", { title: "Upload File" });
};

const uploadPost = [
  async (req, res, next) => {
    try {
      const folder = await prisma.folder.findUnique({
        where: { id: parseInt(req.params.folderId) },
      });
      upload(folder.name).single("file")(req, res, next);
    } catch (error) {
      next(error);
    }
  },
  async (req, res, next) => {
    if (!req.file) {
      // No file was uploaded
      return res.status(400).json({ error: "No file uploaded" });
    }

    // File upload successful
    const fileUrl = req.file.path; // URL of the uploaded file in Cloudinary

    // Perform any additional logic or save the file URL to a database
    try {
      await prisma.file.create({
        data: {
          url: fileUrl,
          name: req.file.originalname,
          size: req.file.size,
          folderId: parseInt(req.params.folderId),
        },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json({ success: true, fileUrl: fileUrl });
  },
];

module.exports = {
  show,
  uploadGet,
  uploadPost,
};
