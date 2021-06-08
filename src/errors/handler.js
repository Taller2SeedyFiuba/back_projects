const { ApiError } = require("./ApiError");

function errorResponse(res, status, error){
  return res.status(status).json({
    "status": "error",
    error
  })
}

function msErrorHandler(err, res) {
  const { response, request, message } = err;

  if (response) {
    console.log(response.data, response.status);
    return errorResponse(res, response.status, response.data.error)
  } else if (request) {
    console.log(request);
    return errorResponse(res, response.status, 'internal-service-req-error')
  } else {                                                    
    console.log('Error', message);
    return errorResponse(res, ApiError.codes.dependencyError, 'internal-service-req-error')
  }
}

function notDefinedHandler(req, res, next) {
  //Create error msg
  const error = ApiError.notFound("Asked resource do not exists")
  next(error);
}

function errorHandler(error, req, res, next) {
  if (error instanceof ApiError) {
    return errorResponse(res, error.code, error.message)
  }
  if (error.isAxiosError){
    return msErrorHandler(error, res)
  }
  if (error instanceof Error) {
    if (error.status && error.status < 500) {
      return errorResponse(res, error.status, error.message)
    }
  }
  console.error("SERVER ERROR: " + error.message);
  return errorResponse(res, ApiError.codes.serverError, "internal-server-error")
}

const hocError = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  notDefinedHandler,
  msErrorHandler,
  errorHandler,
  hocError
}

