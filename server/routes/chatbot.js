// backend/routes/chatbot.js
const express = require('express');
const router = express.Router();
const Car = require('../models/carModel');
const Brand = require('../models/carBrand');
const Order = require('../models/orderModel');

// Gestion d'état par utilisateur
const userStates = {};

// Fonction pour nettoyer le texte
const cleanText = (text) => text ? text.toLowerCase().trim() : '';

// Fonction pour trouver une marque dans le message
const findBrandInMessage = async (message) => {
    const brands = await Brand.find({});
    return brands.find(brand => 
        message.includes(brand.name.toLowerCase())
    );
};

// Fonction pour formater les données des voitures
const formatCarData = (cars) => {
    return cars.map(car => ({
        _id: car._id,
        name: car.name,
        price: car.price,
        slug: car.slug,
        image: car.productPictures?.[0] || ''
    }));
};

// Fonction pour formater les données des marques
const formatBrandData = (brands) => {
    return brands.map(brand => ({
        _id: brand._id,
        name: brand.name,
        slug: brand.slug,
        image: brand.brandPictures || ''
    }));
};

// Route principale du chatbot
router.post('/message', async (req, res) => {
    try {
        const userId = req.body.userId || req.ip;
        const userMessage = cleanText(req.body.message);
        let botResponse = "Je n'ai pas compris votre demande. Voici ce que je peux faire : horaires, financement, voitures, marques, ou prise de RDV.";
        let responseType = "text";
        let responseData = null;

        // Gestion des états de conversation
        if (userStates[userId]) {
            const state = userStates[userId];
            
            switch (state.status) {
                case 'collecting_lead_name':
                    state.name = userMessage;
                    state.status = 'collecting_lead_contact';
                    return res.json({ 
                        response: `Merci ${userMessage} ! Comment pouvons-nous vous contacter (téléphone ou email) ?`,
                        type: "text"
                    });

                case 'collecting_lead_contact':
                    state.contact = userMessage;
                    state.status = 'collecting_lead_car_interest';
                    return res.json({ 
                        response: "Parfait ! Quel modèle ou type de véhicule vous intéresse ?",
                        type: "text"
                    });

                case 'collecting_lead_car_interest':
                    state.carInterest = userMessage;
                    
                    // Sauvegarde du lead
                    try {
                        const newLead = new Order({
                            contactInfo: {
                                name: state.name,
                                contact: state.contact
                            },
                            interest: state.carInterest,
                            status: "new_lead"
                        });
                        await newLead.save();
                        botResponse = "Merci ! Un conseiller vous contactera sous 24h.";
                    } catch (error) {
                        console.error("Erreur sauvegarde lead:", error);
                        botResponse = "Votre demande a été enregistrée, mais une erreur est survenue. Nous vous contacterons dès que possible.";
                    }
                    
                    delete userStates[userId];
                    return res.json({ response: botResponse, type: "text" });
            }
        }

        // Gestion des requêtes standard
        if (userMessage.includes("horaire") || userMessage.includes("heure") || userMessage.includes("ouvert")) {
            botResponse = "Nos horaires : Lundi-Vendredi (9h-18h), Samedi (10h-16h).";
        }
        else if (userMessage.includes("financement") || userMessage.includes("credit") || userMessage.includes("paiement")) {
            botResponse = "Nous proposons plusieurs options de financement. Souhaitez-vous plus d'informations ou être contacté par un conseiller ?";
        }
        else if (userMessage.includes("marque") || userMessage.includes("brand")) {
            const brands = await Brand.find({}).limit(5);
            if (brands.length > 0) {
                botResponse = "Voici nos principales marques :";
                responseType = "brands_list";
                responseData = formatBrandData(brands);
            } else {
                botResponse = "Aucune marque disponible actuellement.";
            }
        }
        else if (userMessage.includes("voiture") || userMessage.includes("véhicule") || userMessage.includes("modèle")) {
            const brand = await findBrandInMessage(userMessage);
            
            if (brand) {
                const cars = await Car.find({ brand: brand._id }).limit(3);
                if (cars.length > 0) {
                    botResponse = `Voici nos ${brand.name} disponibles :`;
                    responseType = "cars_list";
                    responseData = formatCarData(cars);
                } else {
                    botResponse = `Aucune ${brand.name} disponible actuellement.`;
                }
            } else {
                const cars = await Car.find({}).limit(3);
                if (cars.length > 0) {
                    botResponse = "Voici nos véhicules disponibles :";
                    responseType = "cars_list";
                    responseData = formatCarData(cars);
                } else {
                    botResponse = "Aucun véhicule disponible actuellement.";
                }
            }
        }
        else if (userMessage.includes("bonjour") || userMessage.includes("salut")) {
            botResponse = "Bonjour ! Comment puis-je vous aider aujourd'hui ?";
        }
        else if (userMessage.includes("rdv") || userMessage.includes("contact") || userMessage.includes("essai")) {
            userStates[userId] = { status: 'collecting_lead_name' };
            botResponse = "Avec plaisir ! Quel est votre nom ?";
        }

        res.json({ response: botResponse, type: responseType, data: responseData });

    } catch (error) {
        console.error("Erreur chatbot:", error);
        res.status(500).json({ 
            response: "Une erreur est survenue. Veuillez réessayer plus tard.", 
            type: "text" 
        });
    }
});

module.exports = router;