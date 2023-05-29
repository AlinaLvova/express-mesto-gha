const router = require('express').Router();

const {
  createUser, getUsers, getUserById, updateAvatar, updateProfile, login,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateProfile);
router.post('/login', login);

module.exports = router;
