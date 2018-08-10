const express = require('express');
const urlsRouter = express.Router();
const generateRandomString = require('../modules/generateRandomString');
const users = require('../users');
const userDb = users.userDb;

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

function urlCreator(url, response) {
  let newShortUrl = generateRandomString(6);
  urlDb[newShortUrl] = url;
  return response.redirect(`/urls/${newShortUrl}`);
};

function httpChecker(http){
  return (http !== "http://");
}

urlsRouter.get("/", (req, res) => {
  let templateVars = {
    urls: urlDb,
    users: userDb
  };
  res.render("urls_index", templateVars);
});


urlsRouter.post("/", (req, res) => {
  let newLongUrl = req.body.longUrl;
  if (httpChecker(newLongUrl.slice(0, 7))) {
    newLongUrl = `http://${newLongUrl}`;
    urlCreator(newLongUrl, res);
  } else {
    urlCreator(newLongUrl, res);
  }
});

urlsRouter.get("/new", (req, res) => {
  res.render("urls_new", { users: userDb });
});

urlsRouter.get("/:id", (req, res) => {
  let templateVars = {
    shortUrl: req.params.id,
    longUrl: urlDb[req.params.id],
    users: userDb[req.cookies.user_id]
  }
  res.render("urls_show", templateVars);
});

urlsRouter.post("/:id", (req, res) => {
  shortUrlUpdater(req.params.id);
  res.redirect("/urls");
});

urlsRouter.post("/:id/delete", (req, res) => {
  urlDeleter(req.params.id);
  res.redirect("/urls");
});

urlsRouter.get("../u/:shortUrl", (req, res) => {
  let longUrl = urlDb[req.params.shortUrl];
  res.redirect(longUrl);
});

urlsRouter.get(".json", (req, res) => {
  res.json(urlDb);
});

module.exports = urlsRouter;
