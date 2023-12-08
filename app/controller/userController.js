const {
  User,
  Auth,
  CourseUser,
  Chapter,
  Content,
  Category,
  Course,
} = require('../models')
const ApiError = require('../../utils/apiError')
const Sequelize = require('sequelize')
const imagekit = require('../libs/imagekit')
const path = require('path')
const Op = Sequelize.Op

const getUsers = async (req, res, next) => {
  try {
    const allUser = await User.findAll()
    res.status(200).json({
      status: 'Success',
      data: {
        allUser,
      },
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const getUserByEmail = async (req, res, next) => {
  const { email } = req.query
  try {
    const user = await Auth.findOne({
      where: { email },
      attributes: ['userId'],
    })
    if (!user) {
      return next(new ApiError('User not found', 404))
    }

    res.status(200).json({
      status: 'Success',
      data: {
        user,
      },
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

// update User
const updateUser = async (req, res, next) => {
  const id = req.params.id
  const userBody = req.body
  const file = req.file
  const condition = { where: { id }, returning: true }
  let image

  try {
    if (file) {
      const filename = file.originalname
      const extension = path.extname(filename)
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      })
      image = uploadedImage.url
    }

    const updatedUser = await User.update({ ...userBody, image }, condition)

    res.status(200).json({
      status: 'success',
      message: `success update course with id ${id}`,
      data: updatedUser,
    })
  } catch (err) {
    if (err.message.split(':')[0] == 'notNull Violation') {
      const errorMessage = err.message.split(':')[1].split('.')[1].split(',')[0]
      next(new ApiError(errorMessage, 400))
      return
    }
    next(new ApiError(err.message, 500))
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (!user) {
      return next(new ApiError('The user with this Id was not found', 404))
    }

    await User.destroy({
      where: {
        id: req.params.id,
      },
    })
    await Auth.destroy({
      where: {
        id: req.params.id,
      },
    })

    res.status(200).json({
      status: 'Success',
      message: 'Deleted successfully',
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const getCourse = async (req, res, next) => {
  const userId = req.params.id
  const { courseId } = req.body

  try {
    console.log('userId:', userId)
    console.log('courseId:', courseId)

    // const existingCourseUser = await CourseUser.findOne({
    //   userId: userId,
    //   courseId: courseId,
    // })
    // console.log(existingCourseUser)

    // if (existingCourseUser) {
    //   return res.status(400).json({
    //     status: 'Fail',
    //     message: 'User already has this course.',
    //   })
    // }
    const newCourseUser = await CourseUser.create({
      userId: userId,
      courseId: courseId,
      courseStatus: 'inProgress',
    })

    res.status(200).json({
      status: 'Success',
      data: {
        newCourseUser,
      },
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const getDataCourse = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const courses = await CourseUser.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          include: [
            { model: Category },
            { model: User, as: 'courseBy' },
            { model: Chapter, include: [{ model: Content }] },
          ],
        },
      ],
    })
    const formattedCourses = courses.map((courseUser) => {
      const course = courseUser.Course
      const modulePerCourse = course.Chapters.length
      const totalDurationPerCourse = course.Chapters.reduce(
        (acc, chapter) =>
          acc +
          chapter.Contents.reduce(
            (contentAcc, content) => contentAcc + parseFloat(content.duration),
            0
          ),
        0
      )
      return {
        id: courseUser.id,
        userId: courseUser.userId,
        courseId: courseUser.courseId,
        courseStatus: courseUser.courseStatus,
        createdAt: courseUser.createdAt,
        updatedAt: courseUser.updatedAt,
        courseCode: course.courseCode,
        categoryId: course.categoryId,
        userId: course.userId,
        courseName: course.courseName,
        image: course.image,
        courseType: course.courseType,
        courseLevel: course.courseLevel,
        rating: course.rating,
        aboutCourse: course.aboutCourse,
        intendedFor: course.intendedFor,
        coursePrice: course.coursePrice,
        courseCreatedAt: course.createdAt,
        courseUpdatedAt: course.updatedAt,
        categoryName: course.Category.categoryName,
        courseBy: {
          id: course.courseBy.id,
          name: course.courseBy.name,
          phoneNumber: course.courseBy.phoneNumber,
          country: course.courseBy.country,
          city: course.courseBy.city,
          role: course.courseBy.role,
          image: course.courseBy.image,
          createdAt: course.courseBy.createdAt,
          updatedAt: course.courseBy.updatedAt,
        },
        chapters: course.Chapters.map((chapter) => {
          return {
            id: chapter.id,
            chapterTitle: chapter.chapterTitle,
            courseId: chapter.courseId,
            createdAt: chapter.createdAt,
            updatedAt: chapter.updatedAt,
            contents: chapter.Contents.map((content) => {
              return {
                id: content.id,
                contentTitle: content.contentTitle,
                contentUrl: content.contentUrl,
                duration: content.duration,
                status: content.status,
                chapterId: content.chapterId,
                createdAt: content.createdAt,
                updatedAt: content.updatedAt,
              }
            }),
          }
        }),
        durationPerCourseInMinutes: Math.round(totalDurationPerCourse),
        modulePerCourse,
        Category: course.toJSON().Category.categoryName,
        Level: course.toJSON().courseLevel,
      }
    })

    // const course = await mapCourse
    res.status(200).json({
      data: formattedCourses,
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const getCourseById = async (req, res, next) => {
  const courseId = req.params.courseId

  try {
    const courseUser = await CourseUser.findByPk(courseId, {
      include: [
        {
          model: Course,
          include: [
            { model: Category },
            { model: User, as: 'courseBy' },
            { model: Chapter, include: [{ model: Content }] },
          ],
        },
      ],
    })

    if (!courseUser) {
      return res.status(404).json({
        error: 'Course not found',
      })
    }

    const course = courseUser.Course
    const modulePerCourse = course.Chapters.length
    const totalDurationPerCourse = course.Chapters.reduce(
      (acc, chapter) =>
        acc +
        chapter.Contents.reduce(
          (contentAcc, content) => contentAcc + parseFloat(content.duration),
          0
        ),
      0
    )

    const formattedCourse = {
      id: courseUser.id,
      userId: courseUser.userId,
      courseId: courseUser.courseId,
      courseStatus: courseUser.courseStatus,
      createdAt: courseUser.createdAt,
      updatedAt: courseUser.updatedAt,
      courseCode: course.courseCode,
      categoryId: course.categoryId,
      userId: course.userId,
      courseName: course.courseName,
      image: course.image,
      description: course.description,
      objectiveCourse: course.objectiveCourse,
      courseType: course.courseType,
      courseLevel: course.courseLevel,
      rating: course.rating,
      aboutCourse: course.aboutCourse,
      intendedFor: course.intendedFor,
      coursePrice: course.coursePrice,
      courseCreatedAt: course.createdAt,
      courseUpdatedAt: course.updatedAt,
      categoryName: course.Category.categoryName,
      contentUrl: course.Chapters[0]?.Contents.find(
        (content) => content.id === 1
      )?.contentUrl,
      courseBy: {
        id: course.courseBy.id,
        name: course.courseBy.name,
        phoneNumber: course.courseBy.phoneNumber,
        country: course.courseBy.country,
        city: course.courseBy.city,
        role: course.courseBy.role,
        image: course.courseBy.image,
        createdAt: course.courseBy.createdAt,
        updatedAt: course.courseBy.updatedAt,
      },
      chapters: course.Chapters.map((chapter) => {
        return {
          id: chapter.id,
          chapterTitle: chapter.chapterTitle,
          courseId: chapter.courseId,
          createdAt: chapter.createdAt,
          updatedAt: chapter.updatedAt,
          contents: chapter.Contents.map((content) => {
            return {
              id: content.id,
              contentTitle: content.contentTitle,
              contentUrl: content.contentUrl,
              duration: content.duration,
              status: content.status,
              chapterId: content.chapterId,
              createdAt: content.createdAt,
              updatedAt: content.updatedAt,
            }
          }),
        }
      }),
      durationPerCourseInMinutes: Math.round(totalDurationPerCourse),
      modulePerCourse,
      Category: course.toJSON().Category.categoryName,
      Level: course.toJSON().courseLevel,
    }

    res.status(200).json({
      data: formattedCourse,
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

module.exports = {
  getUsers,
  getCourse,
  getCourseById,
  getDataCourse,
  getUserByEmail,
  updateUser,
  deleteUser,
}
