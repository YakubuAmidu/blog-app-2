// Express validator
require('express-async-errors');

// Database connection
require('./db/index');

// Express
const express = require('express');

// Dotenv
require('dotenv').config();

// Morgan
const morgan = require('morgan');

// Cors
const cors = require('cors');

// Routes
const postRoute = require('./routers/post');

const app = express();

// Port
const port = 8484;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' }));

app.use('/api/post', postRoute);

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
})


app.listen(port, () => {
    console.log(`App listening on port: ${port}` )
})
