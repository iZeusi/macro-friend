const {errorHandler, withTransaction} = require('../util');
const mongoose = require('mongoose')
const models = require('../models');
const {HttpError} = require('../error');
const logger = require("../logger");

const addFood = errorHandler(withTransaction(async (req, res, session) => {
    const userDoc = await models.User.findOne({_id: mongoose.Types.ObjectId(req.body.contributor)}).exec();
    if (!userDoc) {
        throw new HttpError(400, 'User not found')
    }

    const foodDoc = new models.Food({
        name: req.body.name,
        calories: req.body.calories,
        carbs: req.body.carbs,
        fats: req.body.fats,
        protein: req.body.protein,
        weight: req.body.weight,
        contributor: userDoc.id
    });

    await foodDoc.save({ session });

    return res.json({ id: foodDoc.id });
}));

const updateFood = errorHandler(withTransaction(async (req, res, session) => {
    const foodDoc = await models.Food
        .findOne(req.body.food)
        .exec();
    if (!foodDoc) {
        throw new HttpError(400, 'Food not found')
    }
    await models.Food.findByIdAndUpdate(foodDoc.id, {
        name: req.body.name,
        desktop_image: req.body.desktop_image,
        mobile_image: req.body.mobile_image,
        owner: req.body.owner,
    });

    await foodDoc.save({ session });

    return res.json({ id: foodDoc.id });
}));

const deleteFood = errorHandler(withTransaction(async (req, res, session) => {
    const foodDoc = await models.Food.findById(req.body.food);
    if (!foodDoc) {
        throw new HttpError(400, 'Food not found');
    }

    await models.Food.findByIdAndDelete(foodDoc.id);
    return res.json({ status: "Success" })
}));

const getFood = errorHandler(async (req, res) => {
    const foodDoc = await models.Food.findById(req.body.food).exec();
    if (!foodDoc || foodDoc.length === 0) {
        throw new HttpError(400, 'Food not found');
    }
    return res.json({ foodDoc });
});

const findFood = errorHandler(async (req, res) => {
    const searchTerm = req.params.term;
    const foodDocs = await models.Food.find({ name: { $regex: searchTerm, $options: "i" } }).exec();
    if (!foodDocs || foodDocs.length === 0) throw new HttpError(400, 'Food not found');
    return res.json({ foodDocs });
});

const getFoods = errorHandler(async (req, res) => {
    const foodDocs = await models.Food.find().exec();
    if (!foodDocs || foodDocs.length === 0) throw new HttpError(500, 'No Foods to show');
    return res.json({ foodDocs });
});

module.exports = {
    addFood,
    deleteFood,
    findFood,
    getFood,
    getFoods,
    updateFood,
};