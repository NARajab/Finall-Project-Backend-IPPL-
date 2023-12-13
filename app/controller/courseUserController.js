const {
  User,
  CourseUser,
  Chapter,
  Content,
  Category,
  Course,
} = require('../models')
const ApiError = require('../../utils/apiError')

const getCourse = async (req, res, next) => {
  const userId = req.params.id
  const { courseId } = req.body

  try {
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

const getAllCoursesData = async (req, res, next) => {
  try {
    const courses = await CourseUser.findAll({
      include: [
        {
          model: Course,
          include: [
            { model: Category },
            { model: User, as: 'courseBy' },
            { model: Chapter, include: [{ model: Content }] },
          ],
        },
        {
          model: User,
        },
      ],
    })
    //rajab

    const formattedCourses = courses.map((courseUser) => {
      const course = courseUser.Course
      if (!course || !course.Chapters) {
        return null
      }
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
        user: {
          id: courseUser.User.id, // Assuming you want the user ID from CourseUser
          name: courseUser.User.name,
          phoneNumber: courseUser.User.phoneNumber,
          country: courseUser.User.country,
          city: courseUser.User.city,
          role: courseUser.User.role,
          image: courseUser.User.image,
          createdAt: courseUser.User.createdAt,
          updatedAt: courseUser.User.updatedAt,
        },
        chapters: course.Chapters.map((chapter) => {
          return {
            id: chapter.id,
            chapterTitle: chapter.chapterTitle,
            courseId: chapter.courseId,
            createdAt: chapter.createdAt,
            updatedAt: chapter.updatedAt,
            contents: (chapter.Contents || []).map((content) => {
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

      return formattedCourse
    })

    res.status(200).json({
      data: formattedCourses,
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
      if (!course || !course.Chapters) {
        return null
      }
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
            contents: (chapter.Contents || []).map((content) => {
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

      // Menambahkan informasi pengguna ke setiap objek kursus
      formattedCourse.user = {
        id: userId,
        name: course.courseBy.name,
        phoneNumber: course.courseBy.phoneNumber,
        country: course.courseBy.country,
        city: course.courseBy.city,
        role: course.courseBy.role,
        image: course.courseBy.image,
        createdAt: course.courseBy.createdAt,
        updatedAt: course.courseBy.updatedAt,
      }

      return formattedCourse
    })

    const filteredCourses = formattedCourses.filter((course) => course !== null)

    res.status(200).json({
      data: filteredCourses,
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const getCourseById = async (req, res, next) => {
  const userId = req.params.userId
  const courseId = req.params.courseId

  try {
    const courseUser = await CourseUser.findOne({
      where: {
        userId: userId,
        courseId: courseId,
      },
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
      logging: console.log,
    })

    if (!courseUser) {
      return res.status(404).json({
        error: 'CourseUser not found',
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
      courseId: courseId,
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

const updateCourseStatus = async (req, res, next) => {
  const userId = req.params.userId
  const courseId = req.params.courseId

  try {
    const courseUser = await CourseUser.findOne({
      where: {
        userId: userId,
        courseId: courseId,
      },
      include: [
        {
          model: Course,
          include: [
            {
              model: Chapter,
              include: [{ model: Content }],
            },
          ],
        },
      ],
    })

    if (!courseUser) {
      return res.status(404).json({
        error: 'CourseUser not found',
      })
    }

    // Check if all content statuses are true
    const isCourseCompleted =
      courseUser.Course && courseUser.Course.Chapters
        ? courseUser.Course.Chapters.every((chapter) =>
            chapter.Contents.every((content) => content.status === true)
          )
        : false

    // Update courseStatus based on the check
    const updatedCourseUser = await courseUser.update({
      courseStatus: isCourseCompleted ? 'Selesai' : 'inProgress',
    })

    res.status(200).json({
      data: updatedCourseUser,
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

module.exports = {
  getAllCoursesData,
  getCourse,
  getCourseById,
  getDataCourse,
  updateCourseStatus,
}
