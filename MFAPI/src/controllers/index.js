const auth = require('./authController');
const foods = require('./foodsController');
const meals = require('./mealsController');
const users = require('./usersController');

module.exports = {
    auth,
    foods,
    meals,
    users
}