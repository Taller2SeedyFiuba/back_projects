const { ApiError } = require("./ApiError");
const { logError, logWarn } = require('../utils/log')
const errMsg = require("./messages")

function logErrorByCode(code, message){
  if (code >= 500){
    logError(message)
  } else{
    logWarn(message)
  }
}

function errorResponse(res, status, error){
  return res.status(status).json({
    "status": "error",
    "message": error
  })
}

function msErrorHandler(err, res) {
  const { response, request, message } = err;

  if (response) {
    logErrorByCode(response.status, response.data);
    return errorResponse(res, response.status, response.data.message)
  } else if (request) {
    logError(ApiError.codes.dependencyError, request);
    return errorResponse(res, ApiError.codes.dependencyError, errMsg.INTERNAL_REQ_ERROR)
  } else {
    logError(message);
    return errorResponse(res, ApiError.codes.serverError, errMsg.INTERNAL_ERROR)
  }
}

function notDefinedHandler(req, res, next) {
  //Create error msg
  const error = ApiError.notFound(errMsg.RESOURCE_NOT_FOUND)
  next(error);
}


function errorHandler(error, req, res, next) {
  if (error instanceof ApiError) {
    logErrorByCode(error.code, error.message)
    return errorResponse(res, error.code, error.message)
  }
  if (error.isAxiosError){
    return msErrorHandler(error, res)
  }
  if (error.status && error.status < 500) {
    logWarn(error.message)
    return errorResponse(res, error.status, error.message || errMsg.UNKNOWN_ERROR)
  }
  logError(error.message || errMsg.UNKNOWN_ERROR)
  return errorResponse(res, error.status || ApiError.codes.serverError, errMsg.INTERNAL_ERROR)
}


const hocError = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


module.exports = {
  notDefinedHandler,
  msErrorHandler,
  errorHandler,
  hocError
}

