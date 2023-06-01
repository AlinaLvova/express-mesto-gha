const express = require('express');
const { errors } = require('celebrate');
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const {
  loginValidator,
  signupValidator,
} = require("../middlewares/validation");

const router = express.Router();

router.post('/signin', loginValidator, login);
router.post('/signup', signupValidator, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use(errors());

module.exports = router;
