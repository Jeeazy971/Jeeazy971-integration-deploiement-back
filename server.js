const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

// Importation des routes existantes
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const publicRoutes = require('./src/routes/publicRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// Connexion à MongoDB
connectDB();

app.use(express.json());
app.use(cors());

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// Swagger – documentation de l’API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirection de la racine vers Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

module.exports = app;
