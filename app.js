const express = require("express");
const app = express();
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./lib/prisma");
const passport = require("passport");

const PORT = 6969;

// frontend
const path = require("node:path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// passport things
require("./config/passport");
app.use(
  expressSession({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log(`listening on port ${PORT}`);
});
