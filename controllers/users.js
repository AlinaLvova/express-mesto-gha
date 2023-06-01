const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  SUCCESS_STATUS,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CREATED_STATUS,
  CONFLICT_ERROR,
  DEFAULT_NAME,
  DEFAULT_AVATAR,
  DEFAULT_ABOUT,
  UNAUTHORIZED_ERROR,
} = require('../utils/constants');
const config = require('../config');

// Формат данных пользователя
// const formatUserData = (user) => ({
//   name: user.name,
//   about: user.about,
//   avatar: user.avatar,
//   _id: user._id,
//   email: user.email,
// });

module.exports.createUser = (req, res, next) => {
  const {
    name = DEFAULT_NAME,
    about = DEFAULT_ABOUT,
    avatar = DEFAULT_AVATAR,
    email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(CREATED_STATUS).send({ jwt: user.toJSON() }))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          return res.status(BAD_REQUEST_ERROR).send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
        }
        if (err.code === 11000) {
          return res.status(CONFLICT_ERROR).send({
            message: 'Пользователь с таким email уже зарегистрирован',
          });
        }
        return next(err);
      })
      .catch(next);
  });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user.toJSON());
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next({
          statusCode: BAD_REQUEST_ERROR,
          message: 'Пользователь по указанному _id не найден.',
        });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next({
          statusCode: NOT_FOUND_ERROR,
          message: 'Пользователь с таким id не найден',
        });
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESS_STATUS).send(users.map((user) => user.toJSON())))
    .catch((err) => next(err));
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(SUCCESS_STATUS).send(user.toJSON()))
    .catch((err) => next(err));
};

const updateUser = (req, res, updateData, next) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(SUCCESS_STATUS).send(user.toJSON());
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next({
          statusCode: BAD_REQUEST_ERROR,
          message: 'Переданы некорректные данные при обновлении пользователя.',
        });
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let emailError = false;
  User.findOne({ email })
    .orFail()
    .then((user) => bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        const token = jwt.sign({ _id: user._id }, config.jwtSecretKey, { expiresIn: '7d' });
        // Устанавливаем httpOnly куку
        res.cookie('jwtToken', token, {
          maxAge: 3600,
          httpOnly: true,
        });
        return res.send({jwtToken: token});
      }
      emailError = true;
      throw new Error();
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError || emailError) {
        next({
          statusCode: UNAUTHORIZED_ERROR,
          message: 'Переданы неверные email или пароль',
        });
      }
      return next(err);
    });
};
