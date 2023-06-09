const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  SUCCESS_STATUS,
  CREATED_STATUS,
} = require('../utils/constants');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

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

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ title: name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_STATUS).send({
      name: card.title,
      link: card.link,
      _id: card._id,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner._id.toString() !== userId) {
        throw new ForbiddenError('Нет прав для удаления карточки с указанным _id');
      }
      Card.deleteOne({ _id: req.params.cardId })
        .then(() => {
          res.status(SUCCESS_STATUS).send({ message: 'Пост удалён.' });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Карточка с указанным _id не найдена.'));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      return next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(populateOptions)
    .then((cards) => res.status(SUCCESS_STATUS).send(cards.map(formatCard)))
    .catch((err) => next(err));
};

const updateCardLikes = (req, res, updateQuery, next) => {
  Card.findByIdAndUpdate(req.params.cardId, updateQuery, { new: true })
    .populate(populateOptions)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.status(SUCCESS_STATUS).send(formatCard(card));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const updateQuery = { $addToSet: { likes: req.user._id } };
  updateCardLikes(req, res, updateQuery, next);
};

module.exports.dislikeCard = (req, res, next) => {
  const updateQuery = { $pull: { likes: req.user._id } };
  updateCardLikes(req, res, updateQuery, next);
};
