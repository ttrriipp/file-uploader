const { body, validationResult, matchedData } = require("express-validator");
const { prisma } = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const registerGet = async (req, res) => {
  res.render("auth/register", { title: "Register Account" });
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

const logoutPost = async (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
};

const loginGet = async (req, res) => {
  res.render("auth/login", { title: "Login" });
};

const loginPost = [
  body("username").trim().notEmpty().withMessage("username is required"),
  body("password").trim().notEmpty().withMessage("password is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        title: "Login",
        errors: errors.array(),
      });
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
];

module.exports = {
  registerGet,
  registerPost,
  logoutPost,
  loginGet,
  loginPost,
};
