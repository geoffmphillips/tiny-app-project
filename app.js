const express = require("express");
const app = express();
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['cucumber', 'sassafras', 'honeydew', 'dolphin','dontNeedRealWordsHere'],
  maxAge: 10 * 60 * 1000 // 10 minutes
}))

const bcrypt = require('bcrypt');

const urlsRouter = require('./routes/urls');
app.use('/urls', urlsRouter);

// Importing users database
const users = require('./db/users');
const userDb = users.userDb;

function badLogin(request, response) {
  request.session.errMessage = "Invalid login";
  response.redirect('login');
}

function emailChecker(usersDatabase, userEmail) {
  for (let user in usersDatabase) {
    if (usersDatabase && usersDatabase[user].email === userEmail) {
      return true;
    }
  }
  return false;
}

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  const message = req.session.errMessage || "";
  if(req.session.user_id) {
    let templateVars = {
      users: userDb[req.session.user_id],
      message: message
    };
    res.render("login", templateVars);
  } else {
    let templateVars = {
      message: message,
      users: ''
    };
    res.render("login", templateVars);
  }
});

// If
app.post("/login", (req, res, next) => {
  if (userDb !== {}) {
    for (let user in userDb) {
      if (userDb[user].email === req.body.email && bcrypt.compareSync(req.body.password, userDb[user].password)) {
        req.session.user_id = userDb[user].id;
        req.session.errMessage = "";
        req.session.regErrMessage = "";
        res.redirect(301, "/urls");
      } else {
        badLogin(req, res);
      }
    }
  } else {
    badLogin(req, res);
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const regMessage = req.session.regErrMessage || '';
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    templateVars = {
      users: '',
      message: regMessage
    }
    res.render("urls_register", templateVars);
  }
});

app.post("/register", (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    req.session.regErrMessage = "Please enter an email and password"
    res.redirect("/register");
  } else if (emailChecker(userDb, email)) {
    req.session.regErrMessage = "Email already in use";
    res.redirect("/register");
  } else {
    users.createNewUser(req.body.email, req.body.password);
    res.redirect("/login");
  }
});

app.get("/u/:shortUrl", (req, res) => {
  console.log(urlDb[req.params.shortUrl].longUrl);
  let longUrl = urlDb[req.params.shortUrl].longUrl;
  res.redirect(longUrl);
});

const PORT = 8080;
app.listen(PORT);
