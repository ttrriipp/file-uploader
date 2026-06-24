const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.get("/", (req, res) => {
  res.render("index", { title: "index" });
});

router.get("/register", authController.registerGet);
router.post("/register", authController.registerPost);

module.exports = router;
