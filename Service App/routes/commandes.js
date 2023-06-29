const express = require("express");
var router = express.Router();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase.js')
const { addDays } = require('date-fns');
const admin = require('firebase-admin');
const adminMiddleware = require("../middlewares/adminMiddleware");
const livreurMiddleware = require("../middlewares/livreurMiddleware");




// GET - Récupérer les commandes par ID de livreur
router.get('/commandesLivreur/', livreurMiddleware, async(req, res) => {
    const livreurId = req.headers["x-user-uid"];
    try {
        const commandesRef = db.collection('Commandes');
        const snapshotWithLivreur = await commandesRef.where('Id_Livreur', '==', livreurId).get();

        const commandes = [];

        snapshotWithLivreur.forEach(async(doc) => {
            const commandeData = doc.data();
            const clientId = commandeData.Id_Client;

            // Récupérer le nom complet de l'utilisateur à partir de l'ID du client
            const userRef = db.collection('users').doc(clientId);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                const fullName = userData.fullName;

                // Ajouter le nom complet de l'utilisateur aux données de commande
                commandes.push({ id: doc.id, ...commandeData, clientFullName: fullName });
            }
        });


        res.status(200).json(commandes);
    } catch (error) {
        console.error('Error getting commandes:', error);
        res.sendStatus(500);
    }
});


router.get('/changeCommande/:id', async(req, res) => {

    const livreurId = req.headers["x-user-uid"];

    try {
        const id = req.params.id;
        const db = admin.firestore();
        const commandeRef = db.collection('Commandes').doc(id);
        const doc = await commandeRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        let commande = doc.data();
        let newStatut;
        switch (commande.Statut) {
            case 'En attente':
                newStatut = 'En récuperation';
                break;
            case 'En récuperation':
                newStatut = 'En livraison';
                break;
            case 'En livraison':
                newStatut = 'Livrée';
                break;
            default:
                return res.status(400).json({ message: "Statut de la commande invalide" });
        }

        await commandeRef.update({ Statut: newStatut, Id_Livreur: livreurId });

        res.json({ message: "Statut de la commande mis à jour avec succès", commande });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur du serveur" });
    }
});

router.get('/commandes-with-fullname/', async(req, res) => {
    try {
        const idLivreur = req.headers["x-user-uid"];
        let commandsRef = db.collection('Commandes');

        commandsRef = commandsRef.where('Id_Livreur', '==', null);
        const commandsSnapshot = await commandsRef.get();
        const commands = [];


        commandsSnapshot.forEach((doc) => {
            commands.push({ id: doc.id, ...doc.data() });
        });


        const userPromises = commands.map(async(command) => {
            const userId = command.Id_Client;
            const userDoc = await admin.firestore().collection('users').doc(userId).get();
            const userData = userDoc.data();
            command.fullName = userData.fullName;
            return command;
        });

        const commandsWithFullName = await Promise.all(userPromises);

        res.json(commandsWithFullName);
    } catch (error) {
        console.error('Error retrieving commands with fullName:', error);
        res.status(500).json({ error: 'Failed to retrieve commands with fullName' });
    }
});




router.get('/commandesLivreur-with-fullname/', async(req, res) => {
    try {
        const idLivreur = req.headers["x-user-uid"]; //(XEowgaWc6bZWpqLHqA8AzwE8b9W2)
        let commandsRef = db.collection('Commandes');

        commandsRef = commandsRef.where('Id_Livreur', '==', idLivreur);
        const commandsSnapshot = await commandsRef.get();
        const commands = [];

        commandsSnapshot.forEach((doc) => {
            commands.push({ id: doc.id, ...doc.data() });
        });

        console.log(commands)

        const userPromises = commands.map(async(command) => {
            const userId = command.Id_Client;
            const userDoc = await admin.firestore().collection('users').doc(userId).get();
            const userData = userDoc.data();
            console.log(userData)
            command.fullName = userData.fullName;
            return command;
        });

        const commandsWithFullName = await Promise.all(userPromises);

        res.json(commandsWithFullName);
    } catch (error) {
        console.error('Error retrieving commands with fullName:', error);
        res.status(500).json({ error: 'Failed to retrieve commands with fullName' });
    }
});


router.get('/commandesClient/', async(req, res) => {
    try {
        const idClient = req.headers["x-user-uid"]; //(ex: XEowgaWc6bZWpqLHqA8AzwE8b9W2)
        let commandsRef = db.collection('Commandes');

        commandsRef = commandsRef.where('Id_Client', '==', idClient);
        const commandsSnapshot = await commandsRef.get();
        const commands = [];

        commandsSnapshot.forEach((doc) => {
            commands.push({ id: doc.id, ...doc.data() });
        });

        console.log(commands)

        const userPromises = commands.map(async(command) => {
            const userId = command.Id_Livreur;
            if (userId) {
                const userDoc = await admin.firestore().collection('users').doc(userId).get();
                const userData = userDoc.data();
                console.log(userData)
                command.fullName = userData.fullName;
            } else
                command.fullName = "Aucun";

            return command;
        });

        const commandsWithFullName = await Promise.all(userPromises);

        // Nouvelle requête pour chercher dans la collection 'CommandesQuantitees'
        const commandQuantitiesPromises = commandsWithFullName.map(async(command) => {
            const commandId = command.id;
            const commandQuantitiesDoc = await admin.firestore().collection('CommandesQuantitees').where('Id_Commande', '==', commandId).get();
            const commandQuantitiesData = commandQuantitiesDoc.docs.map(doc => doc.data());
            console.log(commandQuantitiesData)
            command.commandQuantities = commandQuantitiesData;
            return command;
        });

        const commandsWithQuantities = await Promise.all(commandQuantitiesPromises);

        // Nouvelle requête pour chercher dans la collection 'Articles'
        const articlesPromises = commandsWithQuantities.map(async(command) => {
            command.commandQuantities = await Promise.all(command.commandQuantities.map(async(quantity) => {
                const articleId = quantity.Id_Article;
                const articleDoc = await admin.firestore().collection('Articles').doc(articleId).get();
                const articleData = articleDoc.data();
                console.log(articleData)
                quantity.article = articleData;
                return quantity;
            }));
            return command;
        });

        const commandsWithArticles = await Promise.all(articlesPromises);

        res.json(commandsWithArticles);
    } catch (error) {
        console.error('Error retrieving commands with quantities:', error);
        res.status(500).json({ error: 'Failed to retrieve commands with quantities' });
    }
});








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

    // Create the order
    const order = {
        Date_Livraison: admin.firestore.Timestamp.now(),
        Id_Client: req.headers['x-user-uid'],
        Id_Livreur: null,
        Statut: 'En attente'
    };

    // Save the order to Firestore
    try {
        const docRef = await admin.firestore().collection('Commandes').add(order);

        const promises = articles.map((article) => {
            return admin.firestore().collection('CommandesQuantitees').add({
                Id_Article: article.Id_Article,
                Id_Commande: docRef.id,
                Quantitee: article.Quantitee
            });
        });

        await Promise.all(promises);
        console.log("hey")
        res.status(201).send({ id: docRef.id });
    } catch (error) {
        console.error('Error creating order: ', error);
        res.status(500).send('Error creating order');
    }
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