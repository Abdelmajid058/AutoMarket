const express = require('express');
const connection  = require('./database/database');
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
const brandRoutes = require('./routes/brandRoutes')
const carRoutes = require('./routes/carRoutes')

const bodyParser = require('body-parser'); // Importez bodyParser
const cors = require('cors')
const path = require('path');

const app = express(); // <--- DÉCLAREZ 'app' ICI EN PREMIER !

// Middlewares généraux et configurations
app.use(cors());
app.use(express.json()); // Alternative à bodyParser.json() pour Express 4.16+
// Si vous utilisez une version d'Express < 4.16, vous auriez besoin de :
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


dotenv.config()

connection(); // Appel à votre connexion BDD

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('uploads/')); // Cela semble redondant avec la ligne précédente, mais je le garde si c'est voulu


// Importez et utilisez la route du chatbot APRÈS la déclaration de 'app' et les middlewares nécessaires
const chatbotRoutes = require('./routes/chatbot');


require('./models/carModel');  // Ajoutez ceci - assurez-vous qu'ils sont bien utilisés après connexion à la BDD
require('./models/orderModel');


// Routes de votre API
app.use('/api/user',userRoutes);
app.use('/api/brand',brandRoutes);
app.use('/api/car',carRoutes);

app.use('/api/chatbot', chatbotRoutes); // Toutes les requêtes au chatbot iront à /api/chatbot


   
app.listen(process.env.PORT,'0.0.0.0',() => {
    console.log('Car Running on port 5000'); // Ou le port défini dans .env
    console.log('API is running...');
})