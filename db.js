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
  shortUrlUpdater: function(needsUpdate, userId) {
    let longUrl = this.urlDb[needsUpdate].longUrl;
    let newShortUrl = generateRandomString(6);
    this.urlDb[newShortUrl] = {
      id: newShortUrl,
      longUrl: longUrl,
      user: userId,
      views: this.urlDb[needsUpdate].views,
      uniqueVists: this.urlDb[needsUpdate].uniqueVists
    };
    delete this.urlDb[needsUpdate];
  },
  urlDeleter: function(toDelete) {
    delete this.urlDb[toDelete];
  },
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
  }
};
