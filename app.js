const express = require("express");
const app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['cucumber', 'sassafras', 'honeydew', 'dolphin','dontNeedRealWordsHere'],
  maxAge: 10 * 60 * 1000 // 10 minutes
}))

var bcrypt = require('bcrypt');

const urlsRouter = require('./routes/urls');
app.use('/urls', urlsRouter);

const generateRandomString = require('generateRandomString');

function createNewUser(email, password) {
  const newIdKey = generateRandomString(6);
  const hashedPassword = bcrypt.hashSync(password, 10);

  users[newIdKey] = {
    id: newIdKey,
    email: email,
    password: hashedPassword
  };
}

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  for (let user in users) {
    if (users[user].email !== req.body.email) {
      return res.status(403).end("Incorrect email.")
    } else if (users[user].email === req.body.email && users[user].password === req.body.password) {
      res.cookie("user_id", users[user].id);
      res.cookie("email", users[user].email);
      res.cookie("password", users[user].password);
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
  let templateVars =  {
    urls: urlDatabase,
    users: users
   };

  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).end("Please enter an email and password");
  }

  for (let user in users) {
    if (users[user].email === email) {
      return res.status(400).end("Email already in use")
    }
  }

  res.cookie("user_id", newIdKey);
  res.cookie("email", req.body.email);
  res.cookie("password", req.body.password);

  createNewUser(req.body.email, req.body.password);

  res.redirect("/urls");
});

app.get("/u/:shortUrl", (req, res) => {
  let longUrl = urlDatabase[req.params.shortUrl];
  req.session.views = (req.session.views || 0) + 1
  res.redirect(longUrl);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

const PORT = 8080;
app.listen(PORT);
