const { Router } = require("express");
const router = Router();
const authController = require("../controllers/auth");

router.get("/register", authController.registerGet);
router.post("/register", authController.registerPost);
router.post("/logout", authController.logoutPost);
router.get("/login", authController.loginGet);
router.post("/login", authController.loginPost);

module.exports = router;
