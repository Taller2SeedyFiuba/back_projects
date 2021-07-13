class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
  static codes = {
    badRequest: 400,
    notAuthorized: 401,
    notFound: 404,
    serverError: 500,
    dependencyError: 502,
    dependencyTimeout: 504
  }
  static notAuthorized(message) {
    return new ApiError(ApiError.codes.notAuthorized, message)
  }

  static badRequest(message) {
    return new ApiError(ApiError.codes.badRequest, message);
  }

  static notFound(message) {
    return new ApiError(ApiError.codes.notFound, message);
  }

  static dependencyError(message) {
    return new ApiError(ApiError.codes.dependencyError, message);
  }

  static dependencyTimeout(message) {
    return new ApiError(ApiError.codes.dependencyTimeout, message);
  }

  static serverError(message) {
    return new ApiError(ApiError.codes.serverError, message);
  }
};

module.exports = { ApiError };
