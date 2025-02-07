const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

// Importation des routes existantes
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
// Ajout des routes publiques
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

// Swagger – documentation de l’API
appInstance.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirection de la racine vers Swagger
appInstance.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Démarrage du serveur (uniquement si NODE_ENV n'est pas "test")
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    const server = appInstance.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });

    process.on('SIGINT', () => {
        server.close(() => {
            console.log('🛑 Serveur arrêté proprement');
            process.exit(0);
        });
    });
}

module.exports = appInstance;
