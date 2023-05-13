const User = require("../models/user");
const { handleErrors } = require("../utils/errors");
const {
  SUCCESS_STATUS,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CREATED_STATUS
} = require("../utils/constants");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) =>
      res.status(CREATED_STATUS).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      handleErrors(err, res);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(SUCCESS_STATUS).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Пользователь по указанному _id не найден." });
      }
      handleErrors(err, res);
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(SUCCESS_STATUS).send(
        users.map((user) => {
          return {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          };
        })
      );
    })
    .catch((err) => handleErrors(err, res));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(SUCCESS_STATUS).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      handleErrors(err, res);
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(SUCCESS_STATUS).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      handleErrors(err, res);
    });
};
