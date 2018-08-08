function httpChecker(http, response) {
  if (http !== "http://") {
    return response.end("Please enter valid url starting with 'http://'.");
  }
}

module.exports = httpChecker;
