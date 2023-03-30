// Mongoose API
const mongoose = require('mongoose');

// Database connection
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/')
.then(() => console.log('db connected'))
.catch((err) => console.log("db connection failed: ", err.message || err));

