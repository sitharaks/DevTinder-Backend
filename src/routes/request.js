const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middlewares/userAuth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const mongoose = require('mongoose');

requestRouter.use(express.json());

requestRouter.post('/request/send/:userStatus/:toUserId', userAuth, async(req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const userStatus = req.params.userStatus;

        const objectIdRegex = /^[a-fA-F0-9]{24}$/;
        if (!objectIdRegex.test(fromUserId) || !objectIdRegex.test(toUserId)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }
   

        const allowedStatus = ['ignore', 'interested'];
        if (!allowedStatus.includes(userStatus)) {
            return res.status(400).json({ message: 'Invalid user status.' });
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        });

        const toUser = await User.findOne({ _id: toUserId });
        if (!toUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (existingRequest) {
            return res.status(400).json({ message: 'Connection request already exists.' });
        }

        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status: userStatus
        });

        const savedRequest = await newConnectionRequest.save();

        res.status(200).json({ message: 'Connection request sent successfully.', data: savedRequest });
    }catch(error){
        console.error('Error sending connection request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const isAllowedStatus = ['accepted', 'rejected'];
        if(!isAllowedStatus.includes(req.params.status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        if(!connectionRequest) {
            return res.status(404).json({ message: 'Connection request not found or already reviewed.' });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message: 'Connection request reviewed successfully.',
            data: {
                fromUserId: data.fromUserId,
                toUserId: data.toUserId,
                status: data.status
            }
        });

    }
    catch (error) {
        console.error('Error reviewing connection request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = requestRouter;