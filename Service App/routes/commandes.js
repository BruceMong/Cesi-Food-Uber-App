const express = require("express");
var router = express.Router();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase.js')
const { addDays } = require('date-fns');
const admin = require('firebase-admin');

// GET - Récupérer toutes les commandes
router.get('/commandes', async(req, res) => {
    try {
        const commandesRef = db.collection('Commandes');
        const snapshot = await commandesRef.get();

        const commandes = [];
        snapshot.forEach((doc) => {
            commandes.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(commandes);
    } catch (error) {
        console.error('Error getting commandes:', error);
        res.sendStatus(500);
    }
});

// GET - Récupérer une commande par son ID
router.get('/commandes/:id', async(req, res) => {
    try {
        const commandeId = req.params.id;
        const commandeRef = db.collection('Commandes').doc(commandeId);
        const doc = await commandeRef.get();

        if (!doc.exists) {
            return res.sendStatus(404);
        }

        const commande = { id: doc.id, ...doc.data() };
        res.status(200).json(commande);
    } catch (error) {
        console.error('Error getting commande:', error);
        res.sendStatus(500);
    }
});






router.post('/payment', async(req, res) => {
    // Get the order data from the request body
    const { articles } = req.body;
    console.log(req.headers['x-user-uid'])
    console.log(req.headers)

    // Create the order
    const order = {
        Date_Livraison: admin.firestore.Timestamp.now(),
        Id_Client: req.headers['x-user-uid'],
        Id_Livreur: null,
        Statut: 'En attente'
    };

    // Save the order to Firestore
    admin.firestore().collection('Commandes').add(order)
        .then((docRef) => {
            articles.forEach((article) => {
                admin.firestore().collection('CommandesQuantitees').add({
                    Id_Article: article.Id_Article,
                    Id_Commande: docRef.id,
                    Quantitee: article.quantitee
                })
            })
        })
        .then((docRef) => {
            res.status(201).send({ id: docRef.id });
        })
        .catch((error) => {
            console.error('Error creating order: ', error);
            res.status(500).send('Error creating order');
        });
});



// POST - Créer une nouvelle commande
router.post('/commandes', async(req, res) => {
    try {
        const commandeData = req.body;
        const commandeRef = await db.collection('Commandes').add(commandeData);

        res.status(201).json({ id: commandeRef.id });
    } catch (error) {
        console.error('Error creating commande:', error);
        res.sendStatus(500);
    }
});

// PUT - Mettre à jour une commande
router.put('/commandes/:id', async(req, res) => {
    try {
        const commandeId = req.params.id;
        const commandeData = req.body;
        const commandeRef = db.collection('Commandes').doc(commandeId);

        await commandeRef.update(commandeData);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating commande:', error);
        res.sendStatus(500);
    }
});

// DELETE - Supprimer une commande
router.delete('/commandes/:id', async(req, res) => {
    try {
        const commandeId = req.params.id;
        const commandeRef = db.collection('Commandes').doc(commandeId);

        await commandeRef.delete();

        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting commande:', error);
        res.sendStatus(500);
    }
});

module.exports = router;