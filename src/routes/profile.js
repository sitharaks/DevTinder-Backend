const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/userAuth');

profileRouter.use(express.json());

profileRouter.get('/profile', userAuth, (req, res) => {
    res.status(200).json(req.user);
})

module.exports = profileRouter;