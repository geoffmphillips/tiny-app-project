const express = require('express');
const urlsRouter = express.Router();
const generateRandomString = require('../modules/generateRandomString');

// Importing "database"
const db = require('../db');
const userDb = db.userDb;
const urlDb = db.urlDb;

function httpChecker(http){
  return (http !== "http://");
}

// If logged in can view urls connected to account. Else shows error message
urlsRouter.get("/", (req, res) => {
  const message = req.session.errMessage || "";
  if (req.session.user_id) {
    let templateVars = {
      urls: urlDb,
      users: userDb[req.session.user_id],
      message: message
    };
    res.render("urls_index", templateVars);
  } else {
    let templateVars = {
      users: ""
    };
    res.render("urls_index", templateVars);
  }
});

// Creates new urls. Adds "http://"" to start of url if necessary
urlsRouter.post("/", (req, res) => {
  let newLongUrl = req.body.longUrl;
  if (httpChecker(newLongUrl.slice(0, 7))) {
    newLongUrl = `http://${newLongUrl}`;
    db.urlCreator(newLongUrl, req.session.user_id, res);
  } else {
    db.urlCreator(newLongUrl, req.session.user_id, res);
  }
});

// If logged in, allows user to create new urls and clears error message. Else redirects.
urlsRouter.get("/new", (req, res) => {
  req.session.errMessage = "";
  if (req.session.user_id) {
    res.render("urls_new", { users: userDb[req.session.user_id] });
  } else {
    res.redirect('../login');
  }
});

// If short URL entered doesn't exist, gives different error messages if logged in or not. If exists and logged in, allows user to view their URL. Else redirects
urlsRouter.get("/:id", (req, res) => {
  if (!urlDb[req.params.id]) {
    if(!req.session.user_id) {
      req.session.errMessage = "Please log in to view urls";
      res.redirect("../login");
    } else {
      req.session.errMessage = "Not a real short URL";
      res.redirect("/");
    }
  } else if (req.session.user_id) {
    let templateVars = {
      shortUrl: req.params.id,
      longUrl: urlDb[req.params.id].longUrl,
      views: urlDb[req.params.id].views,
      uniqueVists: urlDb[req.params.id].uniqueVists,
      users: userDb[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  } else {
    res.redirect('../login');
  }
});

urlsRouter.post("/:id", (req, res) => {
  db.urlUpdater(req.params.id, req.body.longUrl);
  res.redirect("/urls");
});

urlsRouter.post("/:id/delete", (req, res) => {
  db.urlDeleter(req.params.id);
  res.redirect("/urls");
});

module.exports = urlsRouter;
