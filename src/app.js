const express = require('express');
const json = require('express').json;
const morgan = require('morgan');
const cors = require('cors');
const { log } = require('./config');

//Importamos rutas/endpoints
const startRoutes = require("./routes/index");

//Importamos handlers de error
const { notDefinedHandler,
        errorHandler } = require("./errors/handler");

function createApp(){

    //Iniciamos la aplicacion
    const app = express();

    //Middlewares
    if(log.info){
      app.use(morgan(function (tokens, req, res) {
        return [
          'Info:',
          tokens.method(req, res),
          tokens.url(req, res), '-',
          tokens.status(req, res), '-',
          tokens['response-time'](req, res), 'ms'
        ].join(' ')
      }));
    }
    app.use(cors());
    app.use(json());

    //Rutas
    startRoutes(app)

    //Manejo de errores
    app.use(notDefinedHandler);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };

