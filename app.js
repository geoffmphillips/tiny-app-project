const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;
const cookieSession = require('cookie-session');
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
  res.redirect("/urls");
});



app.get("/login", (req, res) => {
  templateVars = {
    users: users
  }
  res.render("login", templateVars);
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
  let newIdKey = generateRandomString(randomStringLength);
  res.cookie("user_id", newIdKey);
  res.cookie("email", req.body.email);
  res.cookie("password", req.body.password);
  if (!req.body.email || !req.body.password) {
    return res.status(400).end("Please enter an email and password");
  }

  for (let user in users) {
    if (users[user].email === req.body.email) {
      return res.status(400).end("Email already in use.")
    }
  }

  users[newIdKey] = {
    id: newIdKey,
    email: req.body.email,
    password: req.body.password
  };

  res.redirect("/urls");
});

app.get("/u/:shortUrl", (req, res) => {
  let longUrl = urlDatabase[req.params.shortUrl];
  res.redirect(longUrl);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT);
