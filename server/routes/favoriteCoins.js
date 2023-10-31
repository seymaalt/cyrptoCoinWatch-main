const express = require('express');
const router = express.Router();
const FavoriteCoin = require('../models/FavoriteCoin');

router.get('/:userId/favoriteCoins', async (req, res) => {
  try {
    const userId = req.params.userId;
    const favoriteCoins = await FavoriteCoin.find({ userId });
    res.json(favoriteCoins);
  } catch (error) {
    res.status(500).send('Sunucu hatası: ' + error);
  }
});

router.post('/:userId/favoriteCoins', async (req, res) => {
  try {
    const { userId } = req.params;
    const { coinId } = req.body;

    const favoriteCoin = new FavoriteCoin({ userId, coinId });
    await favoriteCoin.save();

    res.send('Favori coin eklendi.');
  } catch (error) {
    res.status(500).send('Sunucu hatası: ' + error);
  }
});

// Kullanıcının favori coin silmesi
router.delete('/:userId/favoriteCoins/:coinId', async (req, res) => {
  try {
    const { userId, coinId } = req.params;

    await FavoriteCoin.findOneAndDelete({ userId, coinId });

    res.send('Favori coin silindi.');
  } catch (error) {
    res.status(500).send('Sunucu hatası: ' + error);
  }
});

module.exports = router;
