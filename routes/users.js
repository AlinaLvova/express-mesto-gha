const router = require('express').Router();

const {
  getUsers, getUserById, updateAvatar, updateProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateProfile);

module.exports = router;
