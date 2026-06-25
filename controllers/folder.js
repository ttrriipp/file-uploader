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
  async (req, res, next) => {
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
      next(error);
    }
  },
];

const editGet = async (req, res, next) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(req.params.folderId) },
    });
    if (!folder) {
      throw new Error("folder doesn't exist");
    }
    res.render("folders/edit", { title: "Edit Folder", folder: folder });
  } catch (error) {
    next(error);
  }
};

const editPost = [
  validateFolder,
  async (req, res, next) => {
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
        where: { id: parseInt(req.params.folderId) },
        data: folder,
      });
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
];

const deleteFolder = async (req, res, next) => {
  try {
    await prisma.folder.delete({
      where: { id: parseInt(req.params.folderId) },
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(req.params.folderId) },
    });
    if (!folder) {
      throw new Error("folder doesn't exist!");
    }
    res.render("folders/show", {
      title: `folder ${folder.name}`,
      folder: folder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGet,
  createPost,
  editGet,
  editPost,
  deleteFolder,
  show,
};
