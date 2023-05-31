const mongoose = require('mongoose');
const Card = require('../models/card');
const { handleErrors } = require('../utils/errors');
const {
  SUCCESS_STATUS,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  CREATED_STATUS,
  UNAUTHORIZED_ERROR,
} = require('../utils/constants');

const populateOptions = [
  { path: 'likes', select: ['name', 'about', 'avatar', '_id'] },
  { path: 'owner', select: ['name', 'about', 'avatar', '_id'] },
];

const formatCard = (card) => ({
  likes: card.likes.map((user) => ({
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    _id: user._id,
  })),
  _id: card._id,
  name: card.title,
  link: card.link,
  owner: {
    name: card.owner.name,
    about: card.owner.about,
    avatar: card.owner.avatar,
    _id: card.owner._id,
  },
  createdAt: card.createdAt,
});

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ title: name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_STATUS).send({
      name: card.title,
      link: card.link,
      _id: card._id,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return handleErrors(err, res);
    });
};

module.exports.deleteCardById = (req, res) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner._id !== userId) {
        throw new mongoose.Error('Нет прав для удаления карточки с указанным _id');
      }
      return res.status(SUCCESS_STATUS).send({ message: 'Пост удалён.' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (err instanceof mongoose.Error) {
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: err.message });
      }
      return handleErrors(err, res);
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(populateOptions)
    .then((cards) => res.status(SUCCESS_STATUS).send(cards.map(formatCard)))
    .catch((err) => handleErrors(err, res));
};

const updateCardLikes = (req, res, updateQuery) => {
  Card.findByIdAndUpdate(req.params.cardId, updateQuery, { new: true })
    .populate(populateOptions)
    .orFail()
    .then((card) => res.status(SUCCESS_STATUS).send(formatCard(card)))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return handleErrors(err, res);
    });
};

module.exports.likeCard = (req, res) => {
  const updateQuery = { $addToSet: { likes: req.user._id } };
  updateCardLikes(req, res, updateQuery);
};

module.exports.dislikeCard = (req, res) => {
  const updateQuery = { $pull: { likes: req.user._id } };
  updateCardLikes(req, res, updateQuery);
};
