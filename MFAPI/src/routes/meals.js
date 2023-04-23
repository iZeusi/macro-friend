const express = require('express');
const controllers = require('../controllers');
const middlewares = require("../middlewares");
const router = express.Router();

router.get('/meal', middlewares.validateRequest, controllers.meals.getMeal);
router.get('/meals', middlewares.validateRequest, controllers.meals.getMeals);
router.post('/meals/date', middlewares.validateRequest, express.urlencoded({ extended: false }), controllers.meals.getMealsByDate);
router.post('/meal', middlewares.validateRequest, express.urlencoded({ extended: false }), controllers.meals.addFoodToMeal);

module.exports = router;