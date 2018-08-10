const express = require('express');
const urlsRouter = express.Router();
const generateRandomString = require('../modules/generateRandomString');
const db = require('../db');
const userDb = db.userDb;
const urlDb = db.urlDb;

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
    db.urlCreator(newLongUrl, req.session.user_id, res);
  } else {
    db.urlCreator(newLongUrl, req.session.user_id, res);
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
  db.shortUrlUpdater(req.params.id, req.session.user_id);
  res.redirect("/urls");
});

urlsRouter.post("/:id/delete", (req, res) => {
  db.urlDeleter(req.params.id);
  res.redirect("/urls");
});

module.exports = urlsRouter;
