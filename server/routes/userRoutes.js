const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/User');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        res.json("Success");
                    } else {
                        res.json("Şifre doğru değil");
                    }
                });
            }
        });
});

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Bu Email Zaten Mevcut!!!");
            } else {
                bcrypt.hash(password, 10)
                    .then(hash => {
                        UserModel.create({ name, email, password: hash })
                            .then(users => res.json(users))
                            .catch(err => res.json(err));
                    }).catch(err => console.log(err.message));
            }
        });
});

module.exports = router;
