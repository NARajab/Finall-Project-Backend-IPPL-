const router = require('express').Router()
const CourseUser = require('../controller/courseUserController')
const authenticate = require('../middlewares/authMe')
const checkRole = require('../middlewares/checkRole')

router.get('/getData', CourseUser.getAllCoursesData)
router.get('/getData/:userId', CourseUser.getDataCourse)
router.get('/getData/:userId/:courseId', CourseUser.getCourseById)
router.patch('/update-status/:userId/:courseId', CourseUser.updateCourseStatus)

router.post(
  '/create/:id',
  authenticate,
  checkRole(['member']),
  CourseUser.getCourse
)

module.exports = router
