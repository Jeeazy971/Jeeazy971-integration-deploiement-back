require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

// Importation des routes
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');

const appInstance = express();

// Connexion à MongoDB
connectDB();

// Middlewares
appInstance.use(express.json());
appInstance.use(cors());

// Routes API
appInstance.use('/api/users', userRoutes);
appInstance.use('/api/auth', authRoutes);

// Swagger – l'instance swaggerUi doit être utilisée ici
appInstance.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirection de la racine vers Swagger
appInstance.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Démarrage du serveur uniquement si l'environnement n'est pas en mode test
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
