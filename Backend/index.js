const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db'); // Assuming this file initializes your MongoDB connection
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const products = require('./Routes/products'); // Import Products router

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter); // Routes for authentication
app.use('/api/products', products); // Routes for products

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
