/*
const codes = {
  notAuthorized: 401,
  badRequest: 400,
  notFound: 404,
  dependencyError: 502,
  dependencyTimout: 504,
  serverError: 500
}
*/

class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
  static codes = {
    notAuthorized: 401,
    badRequest: 400,
    notFound: 404,
    dependencyError: 502,
    dependencyTimout: 504,
    serverError: 500
  }
  static notAuthorized(message) {
    return new ApiError(401, message)
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static dependencyError(message) {
    return new ApiError(502, message);
  }

  static dependencyTimout(message) {
    return new ApiError(504, message);
  }

  static serverError(message) {
    return new ApiError(500, message);
  }
};

module.exports = { ApiError };
