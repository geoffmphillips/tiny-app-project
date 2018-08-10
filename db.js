// User and URL "database" stored here with the method(s) that change/update/delete database

const generateRandomString = require('./modules/generateRandomString');
const bcrypt = require('bcrypt');

module.exports = {
  userDb: {},
  createNewUser: function(email, password) {
    let newIdKey = generateRandomString(6);
    let hashedPassword = bcrypt.hashSync(password, 10);

    this.userDb[newIdKey] = {
      id: newIdKey,
      email: email,
      password: hashedPassword
    };
  },
  urlDb: {},
  urlCreator: function(url, userId, response) {
    let shortUrl = generateRandomString(6);
    this.urlDb[shortUrl] = {
      id: shortUrl,
      longUrl: url,
      user: userId,
      views: 0,
      uniqueVists: 0
    };
    return response.redirect(`/urls/${shortUrl}`);
  },
  urlUpdater: function(shortUrl, newLongUrl) {
    this.urlDb[shortUrl].longUrl = newLongUrl;
  },
  urlDeleter: function(toDelete) {
    delete this.urlDb[toDelete];
  }
};
