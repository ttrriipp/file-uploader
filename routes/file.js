const { Router } = require("express");
const router = Router({ mergeParams: true });
const controller = require("../controllers/file");

router.get("/upload", controller.uploadGet);
router.get("/:fileId", controller.show);

module.exports = router;
