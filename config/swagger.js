// config/swagger.js
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
        url: process.env.NODE_ENV === 'test'
          ? 'http://localhost:5000'
          : 'http://localhost:5000/api',
        description: 'Serveur local',
      },
    ],
  },
  
  apis: ['./src/controllers/*.js', './src/routes/*.js'],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          email: { type: "string" },
          birthDate: { type: "string", format: "date" },
          city: { type: "string" },
          postalCode: { type: "string" },
          role: { type: "string", enum: ["user", "admin"] }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
