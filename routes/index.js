const express = require('express');

const auth = require('../middlewares/auth');
const {
  createUser, login,
} = require('../controllers/users');

const router = express.Router();

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
