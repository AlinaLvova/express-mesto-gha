const router = require('express').Router();

const {
  getUsers, getUserById, updateAvatar, updateProfile, getMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateProfile);

module.exports = router;
