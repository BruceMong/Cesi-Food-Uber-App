const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase.js')
const firebaseAdmin = require('firebase-admin');
const express = require("express");
var router = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");


// PUT - Modifier un utilisateur
router.put("/users/:id", adminMiddleware, async(req, res) => {
    const userId = req.params.id;
    const { fullName, role } = req.body;

    try {
        const userDoc = await db.collection("users").doc(userId).get();

        if (!userDoc.exists) {
            res.status(404).send("User not found");
            return;
        }

        await userDoc.ref.update({
            fullName: fullName,
            role: role,
        });

        res.status(200).send("User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
});

// GET - Récupérer tous les restaurants
router.get('/users', adminMiddleware, async(req, res) => {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();

        const users = [];
        snapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.sendStatus(500);
    }
});

// Route de connexion
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    firebaseAdmin.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
});

router.get("/users/:id", async(req, res) => {
    const userId = req.params.id;

    try {
        const userDoc = await firebaseAdmin.firestore().collection("users").doc(userId).get();

        if (!userDoc.exists) {
            res.status(404).send("User not found");
            return;
        }

        const userData = userDoc.data();

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).send("Error retrieving user");
    }
});

// DELETE - Supprimer un utilisateur
router.delete("/users/:id", adminMiddleware, async(req, res) => {
    const userId = req.params.id;

    try {
        const userDoc = await db.collection("users").doc(userId).get();

        if (!userDoc.exists) {
            res.status(404).send("User not found");
            return;
        }

        await userDoc.ref.delete();
        res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
});

module.exports = router;