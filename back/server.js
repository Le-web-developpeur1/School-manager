require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const errorHandler = require('./middleware/erreurHandler');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const anneeScolaireRoutes = require('./routes/anneeScolaireRoutes');
const classeRoutes = require('./routes/classeRoutes');
const eleveRoutes = require('./routes/eleveRoutes');
const financeRoutes = require('./routes/financeRoutes');
const exportRoutes = require('./routes/exportRoutes');
const initAdminRoute = require('./routes/initAdminRoute');
const statsRoutes = require('./routes/statsRoute');
const matiereRoutes = require('./routes/matiereRoutes');
const settingsRoutes = require('./routes/settingsRoutes');


const connectDB = require("./config/db");


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/annees", anneeScolaireRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/eleves', eleveRoutes);
app.use('/api/paiements', financeRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/setup', initAdminRoute);
app.use('/api/stats', statsRoutes);
app.use('/api/matieres', matiereRoutes);
app.use('/api/settings', settingsRoutes);

connectDB();

const PORT = 4000;
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});