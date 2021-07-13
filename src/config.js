module.exports = {
  port: process.env.PORT || 8080,
  databaseURL: process.env.DATABASE_URL || '',
  env: process.env.NODE_ENV || 'development',
  log: {
    error: process.env.LOG_ERROR || true,
    warn: process.env.LOG_WARN || true,
    info: process.env.LOG_INFO || true,
    debug: process.env.LOG_DEBUG || true,
  }
}
