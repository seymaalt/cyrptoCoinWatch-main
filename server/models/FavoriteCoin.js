const mongoose = require('mongoose');

const favoriteCoinSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  coinId: String, 

});

const FavoriteCoin = mongoose.model('FavoriteCoin', favoriteCoinSchema);

module.exports = FavoriteCoin;