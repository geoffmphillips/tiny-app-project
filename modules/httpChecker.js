function httpChecker(http, response) {
  if (http !== "http://") {
    return response.end("Please enter a url starting with 'http://'.");
  }
}

module.exports = httpChecker;
