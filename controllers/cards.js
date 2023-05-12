const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { title, link } = req.body;
  console.log(title, link, req.user._id);
  Card.create({ title, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: `Произошла ошибка ${err.message}` }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ) 
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
