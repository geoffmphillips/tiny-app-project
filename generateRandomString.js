function generateRandomString(stringLength) {
  let output = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWYXZabcdefghijklmnopqrstuvwyxz0123456789";
  let randomIndex = Math.floor(Math.random() * chars.length);

  for (let i = 0; i < stringLength; i++) {
    output += chars[randomIndex];
  }
  return output;
}

module.exports = generateRandomString;
