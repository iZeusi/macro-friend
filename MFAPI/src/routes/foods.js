const express = require('express');
const controllers = require('../controllers');
const middlewares = require("../middlewares");
const router = express.Router();

router.get('/food', middlewares.validateRequest, express.urlencoded({ extended: false }), controllers.foods.getFood)
router.get('/foods', middlewares.validateRequest, express.urlencoded({ extended: false }), controllers.foods.getFoods);
router.get('/food/:term', middlewares.validateRequest, express.urlencoded({ extended: false }), controllers.foods.findFood);
router.post('/food', middlewares.validateRequest, express.urlencoded({ extended: true }), controllers.foods.addFood);
router.delete('/food', middlewares.validateRequest, express.urlencoded({ extended: false }), controllers.foods.deleteFood);
router.put('/food', middlewares.validateRequest, express.urlencoded({ extended: false }), controllers.foods.updateFood);

module.exports = router;