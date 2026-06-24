const { Router } = require("express");
const router = Router();
const authRouter = require("./auth");
const folderRouter = require("./folder");
const { prisma } = require("../lib/prisma");

router.get("/", async (req, res) => {
  const folders = await prisma.folder.findMany();
  res.render("index", { title: "index", folders: folders });
});

router.get("/upload-file", (req, res) =>
  res.render("upload-file", { title: "Upload File" }),
);

module.exports = {
  indexRouter: router,
  authRouter,
  folderRouter,
};
