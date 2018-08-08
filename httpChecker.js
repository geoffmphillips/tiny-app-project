function httpChecker(http) {
  if (http !== "http://") {
    return res.end("Please enter valid url starting with 'http://'.");
  }
}

module.exports = httpChecker;
