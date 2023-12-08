const ApiError = require('../../utils/apiError')
const { Course } = require('../models')

const checkCourseId = async (req, res, next) => {
  try {
    const isCourseExist = await Course.findByPk(req.params.id)
    if (!isCourseExist) {
      next(new ApiError(`course with id ${req.params.id} not found`, 404))
      return
    }
    next()
  } catch (err) {
    next(new ApiError('internal server error', 500))
  }
}

module.exports = checkCourseId
