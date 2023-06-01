const router = require('express').Router();

const {
  getUsers, getUserById, updateAvatar, updateProfile, getMe,
} = require('../controllers/users');
const {
  getUserByIdValidator,
  updateProfileValidator,
  updateAvatarValidator,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUserByIdValidator, getUserById);
router.patch('/me/avatar', updateAvatarValidator, updateAvatar);
router.patch('/me', updateProfileValidator, updateProfile);

module.exports = router;
