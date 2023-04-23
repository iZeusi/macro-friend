const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false,
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const User = model('User', userSchema);

module.exports = User;