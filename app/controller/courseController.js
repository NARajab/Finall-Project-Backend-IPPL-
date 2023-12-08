const { Op } = require('sequelize')
const path = require('path')
const { Course, Chapter, Content, Category, User } = require('../models')
const ApiError = require('../../utils/apiError')
const imagekit = require('../libs/imagekit')

const getAllCourse = async (req, res, next) => {
  try {
    const { search, category, level, type, sort_by, order_by } = req.query

    const filter = {}
    const order = []

    if (search) {
      filter.courseName = { [Op.iLike]: `%${search}%` }
    }

    if (category) {
      filter.categoryId = category
    }

    if (type) {
      const types = ['free', 'premium']
      if (!types.includes(type)) {
        next(new ApiError('invalid course type input', 400))
      }
      filter.courseType = type.toLowerCase()
    }

    if (level) {
      const levels = ['beginner', 'intermediate', 'advanced']
      if (!levels.includes(level)) {
        next(new ApiError('invalid course level input', 400))
        return
      }
      filter.courseLevel = level.toLowerCase()
    }

    if (sort_by && order_by) {
      if (!['asc', 'desc'].includes(order_by.toLowerCase())) {
        next(
          new ApiError(
            'please fill order_by query parameter with asc or desc',
            400
          )
        )
        return
      }
      order.push([sort_by, order_by.toUpperCase()])
    }

    const getCourse = await Course.findAll({
      where: { ...filter },
      include: [{ model: Category }, { model: User, as: 'courseBy' }],
      order,
    })

    const mapCourse = Promise.all(
      getCourse.map(async (course) => {
        const chaptersByCourseId = await Chapter.findAll({
          where: { courseId: course.id },
          raw: true,
        })
        const contentsByChapterId = Promise.all(
          chaptersByCourseId.map(async (chapter) => {
            const contents = await Content.findAll({
              where: { chapterId: chapter.id },
              raw: true,
            })
            return contents
          })
        )

        const contents = await contentsByChapterId
        const totalDurationPerChapter = contents.map((content) => {
          const sumDuration = content.reduce((acc, curr) => {
            const duration = curr.duration.split(':')
            const minutes = parseInt(duration[0])
            const second =
              duration[1] !== '00' ? parseFloat(duration[1] / 60) : 0
            return (acc += minutes + second)
          }, 0)
          return sumDuration
        })

        const totalDurationPerCourse = totalDurationPerChapter.reduce(
          (acc, curr) => acc + curr,
          0
        )

        const modulePerCourse = await Chapter.count({
          where: {
            courseId: course.id,
          },
        })
        return {
          ...course.toJSON(),
          courseBy: course.toJSON().courseBy.name,
          Category: course.toJSON().Category.categoryName,
          durationPerCourseInMinutes: Math.round(totalDurationPerCourse),
          modulePerCourse,
        }
      })
    )
    const courses = await mapCourse
    res.status(200).json({
      status: 'success',
      data: courses,
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const getOneCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: User, as: 'courseBy' },
        { model: Chapter, include: [{ model: Content }] },
      ],
    })
    const modulePerCourse = await Chapter.count({
      where: {
        courseId: req.params.id,
      },
    })
    const chapters = await Chapter.findAll({
      where: { courseId: req.params.id },
    })

    const getChapterDuration = Promise.all(
      chapters.map(async (chapter) => {
        const contents = await Content.findAll({
          where: { chapterId: chapter.id },
          raw: true,
        })

        const totalDuration = contents.reduce((acc, curr) => {
          const duration = curr.duration.split(':')
          const minutes = parseInt(duration[0])
          const seconds = parseFloat(duration[1] / 60)
          return (acc += minutes + seconds)
        }, 0)
        return totalDuration
      })
    )
    const chapterDuration = await getChapterDuration

    const totalCourseDuration = chapterDuration.reduce((acc, curr) => {
      return acc + curr
    }, 0)

    const objCourse = course.toJSON()

    const Chapters = objCourse.Chapters.map((chapter, i) => {
      return {
        ...chapter,
        durationPerChapterInMinutes: Math.round(chapterDuration[i]),
      }
    })

    res.status(200).json({
      status: 'success',
      data: {
        ...course.toJSON(),
        courseBy: course.toJSON().courseBy.name,
        Category: course.toJSON().Category.categoryName,
        modulePerCourse,
        Chapters,
        durationPerCourseInMinutes: Math.round(totalCourseDuration),
      },
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const createCourse = async (req, res, next) => {
  const courseBody = req.body
  const file = req.file
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

    const newCourse = await Course.create({
      ...courseBody,
      userId: req.user.id,
      image,
    })

    res.status(201).json({
      status: 'success',
      data: newCourse,
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

const updateCourse = async (req, res, next) => {
  const id = req.params.id
  const courseBody = req.body
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

    const updatedCourse = await Course.update(
      { ...courseBody, userId: req.user.id, image },
      condition
    )

    res.status(200).json({
      status: 'success',
      message: `success update course with id ${id}`,
      data: updatedCourse[1],
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

const deleteCourse = async (req, res, next) => {
  const id = req.params.id
  const condition = { where: { id } }
  try {
    await Course.destroy(condition)

    res.status(201).json({
      status: 'success',
      message: `success delete course with id ${id}`,
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

module.exports = {
  getAllCourse,
  getOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
}
