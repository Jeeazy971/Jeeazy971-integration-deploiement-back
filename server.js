const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const swaggerUiDist = require('swagger-ui-dist');
const { swaggerSpec } = require('./config/swagger');

// Importation des routes existantes
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const publicRoutes = require('./src/routes/publicRoutes');

const appInstance = express();

// Connexion à MongoDB
connectDB();

appInstance.use(express.json());
appInstance.use(cors());

// Routes API
appInstance.use('/api/users', userRoutes);
appInstance.use('/api/auth', authRoutes);
appInstance.use('/api/public', publicRoutes);

// Servir les assets Swagger UI à partir de node_modules
const swaggerDistPath = path.join(__dirname, 'node_modules', 'swagger-ui-dist');
console.log('Chemin vers swagger-ui-dist :', swaggerDistPath);
appInstance.use('/api-docs-dist', express.static(swaggerDistPath));

// Exposer la spec OpenAPI en JSON
appInstance.get('/swagger.json', (req, res) => {
    res.json(swaggerSpec);
});

// Route qui renvoie le HTML Swagger
appInstance.get('/api-docs', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>API Gestion des utilisateurs</title>
        <link rel="stylesheet" href="/api-docs-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="/api-docs-dist/swagger-ui-bundle.js"></script>
        <script src="/api-docs-dist/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            SwaggerUIBundle({
              url: '/swagger.json',
              dom_id: '#swagger-ui',
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "StandaloneLayout"
            });
          }
        </script>
      </body>
    </html>
  `);
});

// Rediriger la racine vers /api-docs
appInstance.get('/', (req, res) => {
    res.redirect('/api-docs');
});


module.exports = appInstance;
