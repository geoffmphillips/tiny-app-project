// User "database" stored here with the method(s) that change/update/delete database

const generateRandomString = require('../modules/generateRandomString');
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
  }
};
