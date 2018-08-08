function generateRandomString(stringLength) {
  let output = "";

  for (let i = 0; i < stringLength; i++) {
    output += Math.random().toString(36)[5];
  }
  return output;
}

module.exports = generateRandomString;
