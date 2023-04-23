const {errorHandler, withTransaction} = require('../util');
const models = require('../models');
const {HttpError} = require('../error');
const mongoose = require("mongoose");
const logger = require('../logger');

const getMeal = errorHandler(async (req, res) => {
    const mealDoc = await models.Meal.findById(req.mealId).exec();
    if (!mealDoc) {
        throw new HttpError(400, 'Meal not found');
    }
    return mealDoc;
});

const getMeals = errorHandler(async (req, res) => {
    const mealDocs = await models.Meal.find().exec();
    if (!mealDocs) {
        throw new HttpError(400, 'No Meals to show');
    }
    return mealDocs;
});

const getMealsByDate = errorHandler(async (req, res) => {
   const mealDocs = await models.Meal.find({date: req.body.date}).populate({path: 'foods', model: 'Food'}).exec();
   if (!mealDocs) {
       throw new HttpError(400, 'No Meals to show');
   }

    const formattedMeals = mealDocs.map(meal => ({
        name: meal.name,
        date: meal.date,
        foods: meal.foods.map(food => ({
            name: food.name,
            calories: food.calories,
            carbs: food.carbs,
            fats: food.fats,
            protein: food.protein,
            weight: food.weight
        }))
    }));

    return res.json({meals: formattedMeals});
});

const addFoodToMeal = errorHandler(withTransaction(async (req, res, session) => {
   let mealDoc = await models.Meal.findOne({name: req.body.meal, date: req.body.date}).exec();
   if (!mealDoc) {
       mealDoc = models.Meal({
           name: req.body.meal,
           owner: mongoose.Types.ObjectId(req.body.id),
           foods: req.body.foods,
           date: req.body.date
       });

       await mealDoc.save({session});
   } else {
       foods = mealDoc.foods;
       foods.push(req.body.foods);
       mealDoc.foods = foods;
       await mealDoc.save({session});
       return res.json({ mealDoc });
   }
}));

module.exports = {
    addFoodToMeal,
    getMeal,
    getMeals,
    getMealsByDate
};