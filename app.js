require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerDocs = require('./config/swagger');

// Initialisation de l'application
const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Importation des routes
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Intégration de Swagger
swaggerDocs(app);

// 🔥 Redirection automatique vers Swagger UI
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

module.exports = app; // 📌 Export de l'application pour l'utiliser dans server.js et les tests
