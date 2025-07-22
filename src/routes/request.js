const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middlewares/userAuth');

requestRouter.use(express.json());

requestRouter.get('/sendConnectionRequest', userAuth, (req, res) => {
    const user = req.user;
    res.status(200).json({ message: user.firstName + ' ' + user.lastName + ' has sent you a connection request.' });   
})

module.exports = requestRouter;