const express = require('express');
const cors = require('cors');
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

// 1) Servir les assets (JS/CSS) de Swagger UI depuis swagger-ui-dist
const swaggerDistPath = swaggerUiDist.absolutePath();
appInstance.use('/api-docs-dist', express.static(swaggerDistPath));

// 2) Exposer votre spec OpenAPI au format JSON
appInstance.get('/swagger.json', (req, res) => {
    res.json(swaggerSpec);
});

// 3) Créer une route qui renvoie un HTML minimal pour Swagger UI
appInstance.get('/api-docs', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" href="/api-docs-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="/api-docs-dist/swagger-ui-bundle.js"></script>
        <script src="/api-docs-dist/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            window.ui = SwaggerUIBundle({
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

// Redirection de la racine vers la doc
appInstance.get('/', (req, res) => {
    res.redirect('/api-docs');
});

module.exports = appInstance;
