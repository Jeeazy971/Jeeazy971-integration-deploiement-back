const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API pour la gestion des utilisateurs',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Serveur local sur le port 5000',
      },
      {
        url: 'http://localhost:5001/api',
        description: 'Serveur local sur le port 5001',
      },
      {
        url: "https://jeeazy971-integration-deploiement-back.vercel.app/api",
        description: "Serveur de production",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/controllers/*.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
