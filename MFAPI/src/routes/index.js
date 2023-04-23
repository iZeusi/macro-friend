const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const foodsRouter = require('./foods')
const mealsRouter = require('./meals');
const usersRouter = require('./users');


router.use('/auth', authRouter);
router.use(foodsRouter);
router.use(mealsRouter);
router.use('/users', usersRouter);

module.exports = router;
