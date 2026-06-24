const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");
const bcrypt = require("bcryptjs");

const registerGet = async (req, res) => {
  res.render("register", { title: "Register Account" });
};

const registerPost = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .custom(async (username) => {
      const existingUser = await prisma.user.findUnique({
        where: { username: username },
      });
      if (existingUser) {
        throw new Error("username already exists");
      }
      return true;
    }),
  body("password").trim().notEmpty().withMessage("password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        title: "Register Account",
        errors: errors.array(),
      });
    }

    try {
      const user = matchedData(req);
      user.password = await bcrypt.hash(user.password, 10);
      const createdUser = await prisma.user.create({
        data: user,
      });
      req.login(createdUser, (error) => {
        if (error) {
          return next(error);
        }
        return res.redirect("/");
      });
    } catch (error) {
      throw new Error(error);
    }
  },
];

module.exports = {
  registerGet,
  registerPost,
};
