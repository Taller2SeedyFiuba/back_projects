class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static serverError(message) {
    return new ApiError(500, message);
  }

  static dependencyError(message) {
    return new ApiError(502, message);
  }

  static dependencyTimout(message) {
    return new ApiError(504, message);
  }

};

module.exports = { ApiError };
