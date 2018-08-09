const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const generateRandomString = require("./modules/generateRandomString");
const PORT = 8080;
const httpChecker = require("./modules/httpChecker");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

const randomStringLength = 6;

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars =  {
    urls: urlDatabase,
    users: users
   };
  res.render("urls_index", templateVars);
});

// Checks if user entered url beginning with http://, creates new shortUrl, adds key-value pair to urlDatabase, and redirects to new page
app.post("/urls", (req, res) => {
  let newLongUrl = req.body.longUrl;
  if (httpChecker(newLongUrl.slice(0, 7), res)) {
    res.end("Please enter a url with 'http://' at the beginning.")
  } else {

  let newShortUrl = generateRandomString(randomStringLength);
  urlDatabase[newShortUrl] = newLongUrl;

  res.redirect(`/urls/${newShortUrl}`);
  }
});

app.get("/urls/new", (req, res) => {
  templateVars = {
    users: users
  }
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortUrl: req.params.id,
    longUrl: urlDatabase[req.params.id],
    users: users
  };

  res.render("urls_show", templateVars);
});

// When update button is clicked, creates a new shortUrl, and "updates" the shortUrl by deleting the old key-value pair and adding a new key-value pair
app.post("/urls/:id", (req, res) => {
  let oldShortUrl = req.params.id;
  let longUrl = urlDatabase[oldShortUrl];
  let newShortUrl = generateRandomString(randomStringLength);

  urlDatabase[newShortUrl] = longUrl;
  delete urlDatabase[oldShortUrl];
  res.redirect("/urls");
});

// Creates unsigned cookie with property "username" === their form input
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.name);
  res.redirect("/login");
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
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
  let newIdKey = generateRandomString(randonStringLength);
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

// Deletes key-value pair from urlDatabase
app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
});

app.get("/u/:shortUrl", (req, res) => {
  let longUrl = urlDatabase[req.params.shortUrl];
  res.redirect(longUrl);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
