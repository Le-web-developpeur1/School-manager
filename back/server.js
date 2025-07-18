require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const classeRoutes = require('./routes/classeRoutes');
const eleveRoutes = require('./routes/eleveRoutes');
const financeRoutes = require('./routes/financeRoutes');
const initAdminRoute = require('./routes/initAdminRoute');

const connectDB = require("./config/db");


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/paiements', financeRoutes);
app.use('/api/setup', initAdminRoute);


connectDB();

const PORT = 4000;

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});