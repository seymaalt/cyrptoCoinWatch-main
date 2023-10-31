const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const favoriteCoinRoutes = require('./routes/favoriteCoins');

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/crypto-coin");

app.use('/users', userRoutes);
app.use('/favoriteCoins', favoriteCoinRoutes);

app.listen(3333, () => {
    console.log("Server is running");
});
