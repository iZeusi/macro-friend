const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const foodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true,
        ref: "Grams"
    },
    fats: {
        type: Number,
        required: true,
        ref: "Grams"
    },
    protein: {
        type: Number,
        required: true,
        ref: "Grams"
    },
    weight: {
        type: Number,
        required: true,
        ref: "Grams"
    },
    contributor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
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

const Food = model('Food', foodSchema);

module.exports = Food;