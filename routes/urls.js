const express = require('express');
const urlsRouter = new express.Router();

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function httpChecker(http){
  return (http !== "http://");
}

urlsRouter
  .get("/", (req, res) => {
    res.render("urls_index");
  });
  .post("/", (req, res) => {
    let newLongUrl = req.body.longUrl;
    if (httpChecker(newLongUrl.slice(0, 7))) {
      res.end("Please enter a url with 'http://' at the beginning.")
    } else {
    let newShortUrl = generateRandomString(6);
    urlDatabase[newShortUrl] = newLongUrl;

    res.redirect(`/urls/${newShortUrl}`);
    }
  });
  .get("/new", (req, res) => {
    res.render("urls_new");
  });
  .get("/:id", (req, res) => {
    res.render("urls_show");
  });
  .post("/:id", (req, res) => {
    let oldShortUrl = req.params.id;
    let longUrl = urlDatabase[oldShortUrl];
    let newShortUrl = generateRandomString(6);

    urlDatabase[newShortUrl] = longUrl;
    delete urlDatabase[oldShortUrl];
    res.redirect("/urls");
  });
  // Deletes key-value pair from urlDatabase
  .post("/:id/delete", (req, res) => {
    let shortUrl = req.params.id;
    delete urlDatabase[shortUrl];
    res.redirect("/urls");
  });



module.exports = urlsRouter;
