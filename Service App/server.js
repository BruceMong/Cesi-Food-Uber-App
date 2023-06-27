const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const ports = [3001, 3002, 3003, 3004];

var articlesRouter = require("./routes/articles");
var usersRouter = require("./routes/users");
var restaurantsRouter = require("./routes/restaurants");
var commandesRouter = require("./routes/commandes");

// Use CORS middleware
app.use(cors());

// Use morgan middleware for logging
app.use(morgan('combined'));

app.use(express.json());

app.use("/", restaurantsRouter);
app.use("/", articlesRouter);
app.use("/", usersRouter);
app.use("/", commandesRouter);

function startListening(ports, index = 0) {
    if (index >= ports.length) {
        console.log('No available ports found in the list');
        return;
    }

    const port = ports[index];

    const server = app.listen(port, () => console.log(`Server has started on port: ${port}`));

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying the next one...`);
            startListening(ports, index + 1);
        } else {
            console.error('Error starting the server: ', error);
        }
    });
}

startListening(ports);

module.exports = app;