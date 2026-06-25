const { prisma } = require("../lib/prisma");

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

module.exports = {
  show,
  uploadGet,
};
