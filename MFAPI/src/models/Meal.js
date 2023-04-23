const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const mealSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    foods: {
        type: Array,
    },
    date: {

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

const Meal = model('Meal', mealSchema);

module.exports = Meal;