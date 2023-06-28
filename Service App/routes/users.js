const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase.js')
const firebaseAdmin = require('firebase-admin');
const express = require("express");
var router = express.Router();



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

module.exports = router;