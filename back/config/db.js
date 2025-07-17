const dotenv = require('dotenv').config(({path: './config/.env'}))

const mongoose = require('mongoose');
const connectDB = async() => {
    try {
        mongoose.set('strictQuery', false );
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connectée');
        
    } catch (error) {
        console.log('Erreur de la connexion à mongoDB', error);
        process.exit(1);
    }
}
module.exports = connectDB;