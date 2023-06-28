const express = require("express");
var router = express.Router();
const { FieldValue } = require('firebase-admin/firestore')
const { db } = require('../firebase.js')
const adminMiddleware = require("../middlewares/adminMiddleware");



// GET - Récupérer tous les articles
router.get('/articles', async(req, res) => {
    try {
        const articlesRef = db.collection('Articles');
        const snapshot = await articlesRef.get();

        const articles = [];
        snapshot.forEach((doc) => {
            articles.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(articles);
    } catch (error) {
        console.error('Error getting articles:', error);
        res.sendStatus(500);
    }
});

// GET - Récupérer un article par son ID
router.get('/articles/:id', async(req, res) => {
    try {
        const articleId = req.params.id;
        const articleRef = db.collection('Articles').doc(articleId);
        const doc = await articleRef.get();

        if (!doc.exists) {
            return res.sendStatus(404);
        }

        const article = { id: doc.id, ...doc.data() };
        res.status(200).json(article);
    } catch (error) {
        console.error('Error getting article:', error);
        res.sendStatus(500);
    }
});

// POST - Créer un nouvel article
router.post('/articles', async(req, res) => {
    try {
        const articleData = req.body;
        const articleRef = await db.collection('Articles').add(articleData);

        res.status(201).json({ id: articleRef.id });
    } catch (error) {
        console.error('Error creating article:', error);
        res.sendStatus(500);
    }
});

// PUT - Mettre à jour un article
router.put('/articles/:id', async(req, res) => {
    try {
        const articleId = req.params.id;
        const articleData = req.body;
        const articleRef = db.collection('Articles').doc(articleId);

        await articleRef.update(articleData);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating article:', error);
        res.sendStatus(500);
    }
});


// DELETE - Supprimer un article
router.delete('/articles/:id', adminMiddleware, async(req, res) => {
    console.log(req.params.id)
    try {
        const articleId = req.params.id;
        const articleRef = db.collection('Articles').doc(articleId);

        await articleRef.delete();

        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting article:', error);
        res.sendStatus(500);
    }
});

module.exports = router;