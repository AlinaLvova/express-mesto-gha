const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  SUCCESS_STATUS,
  CREATED_STATUS,
  DEFAULT_NAME,
  DEFAULT_AVATAR,
  DEFAULT_ABOUT,
} = require('../utils/constants');
const config = require('../utils/config');
const { BadRequestError } = require('../errors/badRequestError');
const { ConflictError } = require('../errors/conflictError');
const { NotFoundError } = require('../errors/notFoundError');
const { UnauthorizedError } = require('../errors/unauthorizedError');

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
      .then((user) => res.status(CREATED_STATUS).send(user.toJSON()))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          throw new BadRequestError('Переданы некорректные данные при создании пользователя.');
        }
        if (err.code === 11000) {
          throw new ConflictError('Пользователь с таким email уже зарегистрирован');
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
        throw new BadRequestError('Пользователь по указанному _id не найден.');
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      return next(err);
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
        throw new BadRequestError('Переданы некорректные данные при обновлении пользователя.');
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
    .select('+password')
    .orFail()
    .then((user) => bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        const token = jwt.sign({ _id: user._id }, config.jwtSecretKey, { expiresIn: '7d' });
        // Устанавливаем httpOnly куку
        res.cookie('jwtToken', token, {
          maxAge: 3600,
          httpOnly: true,
        });
        return res.send({ jwtToken: token });
      }
      emailError = true;
      throw new UnauthorizedError('Переданы неверные email или пароль');
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError || emailError) {
        throw new UnauthorizedError('Переданы неверные email или пароль');
      }
      return next(err);
    });
};
