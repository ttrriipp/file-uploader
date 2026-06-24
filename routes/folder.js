const { Router } = require("express");
const router = Router();
const controller = require("../controllers/folder");

router.get("/create", controller.createGet);
router.post("/create", controller.createPost);

module.exports = router;
