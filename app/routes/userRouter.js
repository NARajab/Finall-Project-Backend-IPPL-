const router = require('express').Router()
const multer = require('../middlewares/multer')
const User = require('../controller/userController')
const authenticate = require('../middlewares/authMe')
const checkRole = require('../middlewares/checkRole')

router.get('/', User.getUsers)
router.get('/get', User.getUserByEmail)
router.get('/getData/:userId', User.getDataCourse)
router.get('/getData/:userId/:courseId', User.getCourseById)
router.post('/create/:id', authenticate, checkRole(['member']), User.getCourse)
router.patch(
  '/update/:id',
  authenticate,
  checkRole(['member']),
  multer.single('image'),
  User.updateUser
)
router.delete(
  '/delete/:id',
  authenticate,
  checkRole(['admin']),
  User.deleteUser
)

module.exports = router
