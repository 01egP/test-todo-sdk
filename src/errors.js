class TodoAPIError extends Error {
  constructor(message, statusCode, response = null) {
    super(message);
    this.name = "TodoAPIError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

module.exports = {
  TodoAPIError,
  NetworkError,
};
