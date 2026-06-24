const { Router } = require("express");
const router = Router();
const authRouter = require("./auth");

router.get("/", (req, res) => {
  res.render("index", { title: "index" });
});

router.get("/upload-file", (req, res) =>
  res.render("upload-file", { title: "Upload File" }),
);

module.exports = {
  indexRouter: router,
  authRouter,
};
