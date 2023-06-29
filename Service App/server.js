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

// Use the PORT environment variable if it's available
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server has started on port: ${port}`));

module.exports = app;