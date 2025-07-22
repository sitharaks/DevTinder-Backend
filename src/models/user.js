const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },  
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 0
    },
    gender: {
        type: String,
        validate(value){
            if(!['male','female','other'].includes(value)){
                throw new Error('Invalid gender');
            }
        },
        enum: ['male', 'female', 'other']
    },
    photoUrl: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png'
    },
    bio: {
        type: String,
        maxlength: 500,
        default: 'This user prefers to keep an air of mystery about them.'
    },
    skills: {
        type: [String],
    }
    })

    module.exports = mongoose.model('User', UserSchema);