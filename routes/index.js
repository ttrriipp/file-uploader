const { prisma } = require("../lib/prisma");
const { Router } = require("express");
const router = Router();
const authRouter = require("./auth");
const folderRouter = require("./folder");
const fileRouter = require("./file");

router.get("/", async (req, res) => {
  const folders = await prisma.folder.findMany();
  res.render("index", { title: "index", folders: folders });
});

module.exports = {
  indexRouter: router,
  authRouter,
  folderRouter,
  fileRouter,
};
