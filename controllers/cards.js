const Card = require("../models/card");
const { NotFoundError, handleErrors } = require("../utils/errors");

module.exports.createCard = (req, res) => {
  const { title, link } = req.body;
  Card.create({ title, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: "Переданы некорректные данные при создании карточки.",
          });
      }
      handleErrors(err, res);
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Карточка с указанным _id не найдена." });
      }
      handleErrors(err, res);
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => handleErrors(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message:
              "Переданы некорректные данные для постановки/снятии лайка.",
          });
      }
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Передан несуществующий _id карточки." });
      }
      handleErrors(err, res);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message:
              "Переданы некорректные данные для постановки/снятии лайка.",
          });
      }
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: "Передан несуществующий _id карточки." });
      }
      handleErrors(err, res);
    });
};
