const express = require("express")
const userRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = ['firstName', 'lastName', 'photoUrl', 'bio', 'skills'];
userRouter.get('/user/requests/received', userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const connectionReq = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate('fromUserId', USER_SAFE_DATA);
        res.json({
            message: 'Connection requests fetched successfully',
            data: connectionReq
        });
    }catch(error){
        console.error('Error fetching user requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

userRouter.get('/user/connections', userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionReq = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]}).populate('fromUserId', USER_SAFE_DATA)
            .populate('toUserId', USER_SAFE_DATA);

        const data = connectionReq.map((request) =>{
            if(request.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return request.toUserId;
            }
            return request.fromUserId;
        });

            res.json({
                message: 'User connections fetched successfully',
                data
            });
    } catch (error) {
        console.error('Error fetching user connections:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

userRouter.get('/user/feed', userAuth, async(req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionReq = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId status')

        const hideUserFromFeed = new Set()
        connectionReq.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })

        const userFeed = await User.find({
           $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUserFromFeed) } }
            ]
        }).select(USER_SAFE_DATA);
        res.send(userFeed);
    }catch (error) {
        console.error('Error fetching user feed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = userRouter;