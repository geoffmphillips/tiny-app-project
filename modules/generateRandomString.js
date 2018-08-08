function generateRandomString(stringLength) {
  let output = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWYXZabcdefghijklmnopqrstuvwyxz0123456789";

  for (let i = 0; i < stringLength; i++) {
    let randomIndex = Math.floor(Math.random() * chars.length);
    output += chars[randomIndex];
  }
  return output;
}

module.exports = generateRandomString;
