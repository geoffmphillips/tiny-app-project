const express = require("express");
const app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// const cookieSession = require('cookie-session');
// app.use(cookieSession({
//   name: 'session',
//   keys: ['cucumber', 'sassafras', 'honeydew', 'dolphin','dontNeedRealWordsHere'],
//   maxAge: 10 * 60 * 1000 // 10 minutes
// }))

var bcrypt = require('bcrypt');

const urlsRouter = require('./routes/urls');
app.use('/urls', urlsRouter);

const generateRandomString = require('./modules/generateRandomString');

function createNewUser(email, password) {
  const newIdKey = generateRandomString(6);
  const hashedPassword = bcrypt.hashSync(password, 10);

  userDb[newIdKey] = {
    id: newIdKey,
    email: email,
    password: hashedPassword
  };
}

const userDb = {};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  if(req.cookies !== {}) {
    let templateVars = {
      users: userDb[req.cookies.user_id]
    };
    res.render("login", templateVars);
  } else {
    res.render("login", { users: "" });
  }
});

app.post("/login", (req, res) => {
  for (let user in userDb) {
    if (userDb[user].email !== req.body.email) {
      return res.status(403).end("Incorrect email.")
    } else if (userDb[user].email === req.body.email && bcrypt.compareSync(req.body.password, userDb[user].password)) {
      res.cookie("user_id", userDb[user].id);
      res.cookie("email", userDb[user].email);
      res.cookie("password", userDb[user].password);
      res.redirect(301, "/");
    } else {
      return res.status(403).end("Email and password don't match.")
    }
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.clearCookie('email');
  res.clearCookie('password');
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("urls_register", { users: userDb });
});

app.post("/register", (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).end("Please enter an email and password");
  }
  for (let user in userDb) {
    if (userDb[user].email === email) {
      return res.status(400).end("Email already in use")
    }
  }
  res.cookie("email", req.body.email);
  res.cookie("password", req.body.password);
  createNewUser(req.body.email, req.body.password);
  res.redirect("/urls");
});

const PORT = 8080;
app.listen(PORT);
