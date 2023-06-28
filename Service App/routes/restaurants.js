const { FieldValue } = require('firebase-admin/firestore');
const { db } = require('../firebase.js');
const adminMiddleware = require("../middlewares/adminMiddleware");

const express = require("express");
const router = express.Router();

// GET - Récupérer tous les restaurants
router.get('/restaurants', adminMiddleware, async(req, res) => {
    try {
        const restaurantsRef = db.collection('Restaurants');
        const snapshot = await restaurantsRef.get();

        const restaurants = [];
        snapshot.forEach((doc) => {
            restaurants.push({ id: doc.id, ...doc.data() });
        });
        console.log("new restau")

        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error getting restaurants:', error);
        res.sendStatus(500);
    }
});

// POST - Créer un nouveau restaurant
router.post('/restaurants', async(req, res) => {

    try {
        const restaurantData = req.body; // Supposons que les données du restaurant sont envoyées dans le corps de la requête

        const docRef = await db.collection('Restaurants').add(restaurantData);
        const newRestaurant = { id: docRef.id, ...restaurantData };
        console.log("new restau")
        res.status(201).json(newRestaurant);
    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.sendStatus(500);
    }
});

// GET - Récupérer un restaurant par son ID
router.get('/restaurants/:id', async(req, res) => {
    try {
        const restaurantId = req.params.id;

        const docRef = await db.collection('Restaurants').doc(restaurantId).get();
        if (docRef.exists) {
            const restaurant = { id: docRef.id, ...docRef.data() };
            res.status(200).json(restaurant);
        } else {
            res.sendStatus(404); // Le restaurant n'a pas été trouvé
        }
    } catch (error) {
        console.error('Error getting restaurant:', error);
        res.sendStatus(500);
    }
});

// PUT - Mettre à jour un restaurant
router.put('/restaurants/:id', async(req, res) => {
    try {
        const restaurantId = req.params.id;
        const updatedData = req.body; // Supposons que les nouvelles données du restaurant sont envoyées dans le corps de la requête

        await db.collection('Restaurants').doc(restaurantId).update(updatedData);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.sendStatus(500);
    }
});

// DELETE - Supprimer un restaurant
router.delete('/restaurants/:id', async(req, res) => {
    try {
        const restaurantId = req.params.id;

        await db.collection('Restaurants').doc(restaurantId).delete();

        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.sendStatus(500);
    }
});

module.exports = router;