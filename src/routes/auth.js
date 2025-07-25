const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validateSignup } = require('../utils/validateSignup');

authRouter.use(express.json());

authRouter.post('/signup', async ( req, res) => {
    const { isValid, errors } = validateSignup(req);
    if (!isValid) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const userObj = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash,
    })
    try{
        await userObj.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' + error.message }); 
    }
  
})

authRouter.post('/login', async (req, res)=> {
    const { email, password } = req.body;
    const userEmail = await User.findOne({ email: email });
    if (!userEmail) {
        return res.status(404).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, userEmail.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: userEmail._id }, 'sith@133732gdgdhus', {
        expiresIn: '1h' // Token expiration time
    });
    res.cookie('token', token);
    res.send(userEmail);
})

authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.cookie('token', '', { expires: new Date(0) }); // Clear the cookie
    res.status(200).json({ message: 'Logout successful' });
});
module.exports = authRouter;