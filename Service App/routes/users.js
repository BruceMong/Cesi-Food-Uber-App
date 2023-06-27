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

module.exports = router;