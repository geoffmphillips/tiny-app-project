const express = require('express');
const urlsRouter = express.Router();
const generateRandomString = require('../modules/generateRandomString');

let urlDb = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function shortUrlUpdater(needsUpdate) {
  let oldShortUrl = needsUpdate;
  let longUrl = urlDb[oldShortUrl];
  let newShortUrl = generateRandomString(6);
  urlDb[newShortUrl] = longUrl;
  delete urlDb[oldShortUrl];
};

function urlDeleter(toDelete) {
  delete urlDb[toDelete];
}

function httpChecker(http){
  return (http !== "http://");
}

urlsRouter.get("/", (req, res) => {
  res.render("urls_index", { urls: urlDb } );
});

urlsRouter.post("/", (req, res) => {
  let newLongUrl = req.body.longUrl;
  if (httpChecker(newLongUrl.slice(0, 7))) {
    newLongUrl = `http://${newLongUrl}`;
  } else {
    let newShortUrl = generateRandomString(6);
    urlDb[newShortUrl] = newLongUrl;
    res.redirect(`/urls/${newShortUrl}`);
  }
});

urlsRouter.get("/new", (req, res) => {
  res.render("urls_new");
});

urlsRouter.get("/:id", (req, res) => {
  let url = {
    shortUrl: req.params.id,
    longUrl: urlDb[req.params.id]
  }
  res.render("urls_show", url);
});

urlsRouter.post("/:id", (req, res) => {
  shortUrlUpdater(req.params.id);
  res.redirect("/urls");
});

urlsRouter.post("/:id/delete", (req, res) => {
  urlDeleter(req.params.id);
  res.redirect("/urls");
});

module.exports = urlsRouter;
