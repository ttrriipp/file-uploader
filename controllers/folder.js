const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");

const createGet = (req, res) => {
  res.render("folders/create", { title: "Create Folder" });
};

const createPost = [
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
      res.redirect("/folders");
    } catch (error) {
      throw new Error(error);
    }
  },
];

module.exports = {
  createGet,
  createPost,
};
