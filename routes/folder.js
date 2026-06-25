const { Router } = require("express");
const router = Router();
const controller = require("../controllers/folder");

router.get("/create", controller.createGet);
router.post("/create", controller.createPost);
router.get("/:id/edit", controller.editGet);
router.post("/:id/edit", controller.editPost);
router.post("/:id/delete", controller.deleteFolder);
router.get("/:id", controller.show);

module.exports = router;
