const { User, Auth } = require('../models')
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

module.exports = {
  getUsers,

  getUserByEmail,
  updateUser,
  deleteUser,
}
