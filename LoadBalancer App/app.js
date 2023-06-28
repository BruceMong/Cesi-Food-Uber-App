const express = require('express');
const cors = require('cors');
const httpProxy = require('http-proxy');
const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const morgan = require('morgan');
const serviceAccount = require('./creds.json');

// Initialize Firebase Admin
initializeApp({
    credential: cert(serviceAccount)
});

// List of servers to balance
const servers = [
    'http://localhost:3001',
    //'http://localhost:3002',
    //'http://localhost:3003'
];

let i = 0;

// Create the proxy
const proxy = httpProxy.createProxyServer({});

// Create the server
const app = express();

// Use CORS middleware
app.use(cors());

// Use morgan middleware for logging
app.use(morgan('combined'));

app.use((req, res, next) => {
    // Retrieve the token from the authorization header
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401).send("Unauthorized");
        return;
    }

    // Verify the token
    admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            req.uid = decodedToken.uid;
            // Get user role from Firestore
            return admin.firestore().collection("users").doc(req.uid).get();
        })
        .then((userDoc) => {
            if (!userDoc.exists) {
                res.status(404).send("User not found");
                return;
            }

            // Add user role to the request
            req.role = userDoc.data().role;

            // Add user info to the request headers
            req.headers["x-user-uid"] = req.uid;
            req.headers["x-user-role"] = req.role;

            // If the token is valid, rotate the servers
            proxy.web(req, res, { target: servers[i] });

            i = (i + 1) % servers.length;
        })
        .catch(() => {
            // If the token is not valid, return an error
            res.status(401).send("Unauthorized");
        });
});

// Add this middleware to catch the response after proxying
app.use((req, res) => {
    // Handle the response from the target server
    proxy.on("proxyRes", (proxyRes) => {
        res.status(proxyRes.statusCode);
        Object.keys(proxyRes.headers).forEach((key) => {
            res.setHeader(key, proxyRes.headers[key]);
        });
        proxyRes.on("data", (chunk) => {
            res.write(chunk);
        });
        proxyRes.on("end", () => {
            res.end();
        });
    });
});

app.listen(3000, () => {
    console.log("Load balancer listening on port 3000");
});