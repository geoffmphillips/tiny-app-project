const express = require('express');
const urlsRouter = express.Router();
const generateRandomString = require('../modules/generateRandomString');
const users = require('../db/users');
const userDb = users.userDb;

const urlDb = {};

function shortUrlUpdater(needsUpdate, userId) {
  let longUrl = urlDb[needsUpdate].longUrl;
  let newShortUrl = generateRandomString(6);
  urlDb[newShortUrl] = {
    id: newShortUrl,
    longUrl: longUrl,
    user: userId
  };
  delete urlDb[needsUpdate];
};

function urlDeleter(toDelete) {
  delete urlDb[toDelete];
}

function urlCreator(url, userId, response) {
  let shortUrl = generateRandomString(6);
  urlDb[shortUrl] = {
    id: shortUrl,
    longUrl: url,
    user: userId
  };
  return response.redirect(`/urls/${shortUrl}`);
};

function httpChecker(http){
  return (http !== "http://");
}

urlsRouter.get("/", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {
      urls: urlDb,
      users: userDb[req.session.user_id]
    };
    res.render("urls_index", templateVars);
  } else {
    let templateVars = {
      users: ''
    };
    res.render("urls_index", templateVars);
  }
});

urlsRouter.post("/", (req, res) => {
  let newLongUrl = req.body.longUrl;
  if (httpChecker(newLongUrl.slice(0, 7))) {
    newLongUrl = `http://${newLongUrl}`;
    urlCreator(newLongUrl, req.session.user_id, res);
  } else {
    urlCreator(newLongUrl, req.session.user_id, res);
  }
});

urlsRouter.get("/new", (req, res) => {
  if (req.session.user_id) {
    res.render("urls_new", { users: userDb[req.session.user_id] });
  } else {
    res.redirect('../login');
  }
});

urlsRouter.get("/:id", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {
      shortUrl: req.params.id,
      longUrl: urlDb[req.params.id].longUrl,
      users: userDb[req.session.user_id]
    }
    res.render("urls_show", templateVars);
  } else {
    res.redirect('../login');
  }
});

urlsRouter.post("/:id", (req, res) => {
  shortUrlUpdater(req.params.id, req.session.user_id);
  res.redirect("/urls");
});

urlsRouter.post("/:id/delete", (req, res) => {
  urlDeleter(req.params.id);
  res.redirect("/urls");
});

urlsRouter.get(".json", (req, res) => {
  res.json(urlDb);
});

module.exports = urlsRouter;
