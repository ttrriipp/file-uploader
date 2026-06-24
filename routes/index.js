const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.get("/", (req, res) => {
  res.render("index", { title: "index" });
});

router.get("/register", authController.registerGet);
router.post("/register", authController.registerPost);
router.post("/logout", authController.logoutPost);
router.get("/login", authController.loginGet);
router.post("/login", authController.loginPost);
router.get("/upload-file", (req, res) =>
  res.render("upload-file", { title: "Upload File" }),
);

module.exports = router;
