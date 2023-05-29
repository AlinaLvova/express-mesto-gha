const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { handleErrors } = require('../utils/errors');
const {
  SUCCESS_STATUS,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CREATED_STATUS,
  CONFLICT_ERROR,
  DEFAULT_NAME,
  DEFAULT_AVATAR,
  DEFAULT_ABOUT,
} = require('../utils/constants');

// Формат данных пользователя
const formatUserData = (user) => ({
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  _id: user._id,
  email: user.email,
});

module.exports.createUser = (req, res) => {
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
      .then((user) => res.status(CREATED_STATUS).send(user.toJSON()))
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
        return handleErrors(err, res);
      });
  });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(SUCCESS_STATUS).send(formatUserData(user));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND_ERROR).send({
          message: 'Пользователь с таким id не найден',
        });
      }
      return handleErrors(err, res);
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_STATUS).send(users.map((user) => formatUserData(user))))
    .catch((err) => handleErrors(err, res));
};

const updateUser = (req, res, updateData) => {
  User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(SUCCESS_STATUS).send(formatUserData(user));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при обновлении пользователя.',
        });
      }
      return handleErrors(err, res);
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
