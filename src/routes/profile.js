const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/userAuth');
const validateProfileEdit = require('../utils/validateProfileEdit');
const validateProfilePassword = require('../utils/validateProfilePassword');
const bcrypt = require('bcrypt');

profileRouter.use(express.json());

profileRouter.get('/profile/view', userAuth, (req, res) => {
    res.status(200).json(req.user);
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ message: 'Request body is missing or invalid' });
        }
        const isValid = validateProfileEdit(req);
        const user = req.user;
        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);
        await user.save();
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid profile fields' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

profileRouter.patch('/profile/changePassword', userAuth, async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ message: 'Request body is missing or invalid' });
        }
        if(validateProfilePassword(req)){
            const user = req.user;
            user.password = await bcrypt.hash(req.body.password, 10);
            await user.save();
            res.status(200).json({ message: 'Password changed successfully' });
        }
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = profileRouter;