const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignore', 'accepted', 'interested', 'rejected'],
            message: `{VALUE} is not a valid status`
        },
    }
},{
    timestamps: true
});

connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        return next(new Error('Cannot send a connection request to yourself.'));        
    }
    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;