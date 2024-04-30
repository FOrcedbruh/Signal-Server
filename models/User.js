const { Schema, model } = require('mongoose');




const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    avatar: {
        type: String,
        default: ""
    }
}, {timestamps: true});


module.exports = model('User', UserSchema);