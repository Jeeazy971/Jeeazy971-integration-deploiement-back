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
        url: process.env.NODE_ENV === 'production' && process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api`
          : "http://localhost:5000/api",
        description: process.env.NODE_ENV === 'production'
          ? "Serveur de production"
          : "Serveur local sur le port 5000",
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
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b2c9e3a1f1234567890a" },
            firstName: { type: "string", example: "Alice" },
            lastName: { type: "string", example: "Dupont" },
            email: { type: "string", format: "email", example: "alice.dupont@example.com" },
            birthDate: { type: "string", format: "date", example: "1980-05-20" },
            city: { type: "string", example: "Paris" },
            postalCode: { type: "string", example: "75001" },
            role: { type: "string", enum: ["user", "admin"], example: "user" }
          }
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ],
  },
  apis: ['./src/controllers/*.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };
