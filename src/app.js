const express = require('express');
const json = require('express').json;
const morgan = require('morgan');

//Documentacion de swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");



//Importamos rutas/endpoints
const { getProjectsRouter } = require("./routes/projects");
const { getGeneralRouter } = require("./routes/general");

//Importamos handlers de error
const { notDefinedHandler, errorHandler} = require("./errors/errorHandler");

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: "API Servicio de Proyectos",
        description: "API del servicio de proyectos para el TP SeedyFiuba de Taller 2 FIUBA",
        contact: {
          name: "SeedyFiuba",
          url: "https://github.com/Taller2SeedyFiuba"
        },
        version: "1.0.0"
        //servers: ['http://localhost:8080']
      }
    },
    apis: ['src/routes/projects.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

function createApp(database, proxy, log=true){

    //Iniciamos la aplicacion
    const app = express();
    
    //Middlewares
    if(log) app.use(morgan('dev')); //Escupir a archivo con una ip y timestamp.
    app.use(json());

    //Rutas
    app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use('/api/general', getGeneralRouter(database));
    app.use('/api', getProjectsRouter(database, proxy));

    app.use(notDefinedHandler);
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };

