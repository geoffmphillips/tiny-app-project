const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const generateRandomString = require("./generateRandomString");
const PORT = 8080;
const httpChecker = require("./httpChecker")
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const stringLength = 6;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  let templateVars =  { urls: urlDatabase };
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

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortUrl: req.params.id,
    longUrl: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  let oldShortUrl = req.params.id;
  let longUrl = urlDatabase[oldShortUrl];
  let newShortUrl = generateRandomString(stringLength);

  urlDatabase[newShortUrl] = longUrl;
  delete urlDatabase[oldShortUrl];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  let cookieName = req.body.name;
  res.cookie("username", cookieName);
  res.redirect("/urls");
});

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
