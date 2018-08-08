const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const generateRandomString = require("./generateRandomString");
const PORT = 8080;
const httpChecker = require("./httpChecker");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const stringLength = 6;  // String length when generating random string

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars =  {
    urls: urlDatabase,
    username: req.cookies.username
   };
  res.render("urls_index", templateVars);
});

// Checks if user entered url beings with http://, creates new shortUrl, adds key-value pair to urlDatabase, and redirects to new page
app.post("/urls", (req, res) => {
  let newLongUrl = req.body.longUrl;
  httpChecker(newLongUrl.slice(0, 7), res);

  let newShortUrl = generateRandomString(stringLength);
  urlDatabase[newShortUrl] = newLongUrl;

  res.redirect(`/urls/${newShortUrl}`);
});

app.get("/urls/new", (req, res) => {
  templateVars = {
    username: req.cookies.username
  }
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortUrl: req.params.id,
    longUrl: urlDatabase[req.params.id],
    username: req.cookies.username
  };

  res.render("urls_show", templateVars);
});

// When update button is clicked, creates a new shortUrl, and "updates" the shortUrl by deleting the old key-value pair and adding a new key-value pair
app.post("/urls/:id", (req, res) => {
  let oldShortUrl = req.params.id;
  let longUrl = urlDatabase[oldShortUrl];
  let newShortUrl = generateRandomString(stringLength);

  urlDatabase[newShortUrl] = longUrl;
  delete urlDatabase[oldShortUrl];
  res.redirect("/urls");
});

// Creates unsigned cookie with property "username" === their form input
app.post("/login", (req, res) => {
  res.cookie("username", req.body.name);
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
