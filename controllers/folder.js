const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");

const validateFolder = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("folder name is required")
    .custom(async (name) => {
      const existingFolder = await prisma.folder.findUnique({
        where: { name: name },
      });
      if (existingFolder) {
        throw new Error("folder name already exists");
      }
      return true;
    }),
];

const createGet = (req, res) => {
  res.render("folders/create", { title: "Create Folder" });
};

const createPost = [
  validateFolder,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("folders/create", {
        title: "Create Folder",
        errors: errors.array(),
      });
    }
    try {
      const folder = matchedData(req);
      await prisma.folder.create({
        data: folder,
      });
      res.redirect("/");
    } catch (error) {
      throw new Error(error);
    }
  },
];

const editGet = async (req, res) => {
  const folder = await prisma.folder.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.render("folders/edit", { title: "Edit Folder", folder: folder });
};

const editPost = [
  validateFolder,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("folders/edit", {
        title: "Edit Folder",
        errors: errors.array(),
      });
    }
    try {
      const folder = matchedData(req);
      await prisma.folder.update({
        where: { id: parseInt(req.params.id) },
        data: folder,
      });
      res.redirect("/");
    } catch (error) {
      throw new Error(error);
    }
  },
];

module.exports = {
  createGet,
  createPost,
  editGet,
  editPost,
};
