const { log } = require('../config')

const logInfo = function(message){
  if (log.info){
    console.log('Info: ' + message);
  }
}

const logDebug = function(message){
  if (log.debug){
    console.log('Debug: ' + message);
  }
}

const logWarn = function(message){
  if (log.warn){
    console.log('Warn: ' + message);
  }
}

const logError = function(message){
  if (log.error){
    console.log('Error: ' + message);
  }
}

module.exports = {
  logInfo,
  logDebug,
  logWarn,
  logError
}
