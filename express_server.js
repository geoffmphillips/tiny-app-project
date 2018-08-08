const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const generateRandomString = require('./generateRandomString');
const PORT = 8080; // default port 8080
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
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls", (req, res) => {
  let templateVars =  { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  // Checks if valid URL has been entered by user
  if (req.body.longURL.slice(0,7) !== "http://") {
    return res.end("Please enter valid url starting with 'http://'.");
  }
  // Creates shortened URL and adds key-value pair to urlDatabase
  let newUrl = generateRandomString(6);
  urlDatabase[newUrl] = req.body.longURL;

  res.redirect(`/urls/${newUrl}`);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls:id", (req, res) => {

});

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
