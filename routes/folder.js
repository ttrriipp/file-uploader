const { Router } = require("express");
const router = Router();
const controller = require("../controllers/folder");

router.get("/create", controller.createGet);
router.post("/create", controller.createPost);
router.get("/:folderId/edit", controller.editGet);
router.post("/:folderId/edit", controller.editPost);
router.post("/:folderId/delete", controller.deleteFolder);
router.get("/:folderId", controller.show);

module.exports = router;
