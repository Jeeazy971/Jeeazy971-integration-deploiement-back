// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

// Importation des routes
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');

const appInstance = express();

// Connexion à la base de données
connectDB();

// Middlewares
appInstance.use(express.json());
appInstance.use(cors());

// Routes API
appInstance.use('/api/users', userRoutes);
appInstance.use('/api/auth', authRoutes);

// Swagger
appInstance.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirection de la racine vers Swagger
appInstance.get('/', (req, res) => {
    res.redirect('/api-docs');
});

const PORT = process.env.PORT || 5001;
appInstance.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = appInstance;
