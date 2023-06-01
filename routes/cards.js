const router = require('express').Router();

const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  createCardValidator,
  inputIdCardValidator,
} = require("../middlewares/validation");

router.post('/', createCardValidator, createCard);
router.get('/', getCards);
router.delete('/:cardId', inputIdCardValidator, deleteCardById);
router.put('/:cardId/likes', inputIdCardValidator, likeCard);
router.delete('/:cardId/likes', inputIdCardValidator, dislikeCard);

module.exports = router;
