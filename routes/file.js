const { Router } = require("express");
const router = Router({ mergeParams: true });
const controller = require("../controllers/file");

router.get("/upload", controller.uploadGet);
router.post("/upload", controller.uploadPost);
router.get("/:fileId", controller.showFile);
router.get("/:fileId/download", controller.downloadFile);

module.exports = router;
