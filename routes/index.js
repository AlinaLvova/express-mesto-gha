const express = require('express');

const {
  createUser, login,
} = require('../controllers/users');

const router = express.Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
