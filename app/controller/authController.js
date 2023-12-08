const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Auth, User, OTP } = require('../models')
const generatedOTP = require('../../utils/generatedOTP')
const { AUTH_EMAIL } = process.env
const sendEmail = require('../../utils/sendEmail')

const ApiError = require('../../utils/apiError')
const scheduleOtpDeletion = require('../../utils/scheduleDeletion')

const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, country, city } = req.body

    const user = await Auth.findOne({
      where: {
        email,
      },
    })

    if (user) {
      return next(new ApiError('User email already taken', 400))
    }

    const passwordLength = password.length < 8
    if (passwordLength) {
      return next(new ApiError('Minimum password must be 8 characters', 400))
    }

    const saltRounds = 10
    const hashedPassword = bcrypt.hashSync(password, saltRounds)

    const newUser = await User.create({
      name,
      phoneNumber,
      country,
      city,
    })
    const test = await Auth.create({
      email,
      password: hashedPassword,
      userId: newUser.id,
    })

    const newCode = await generatedOTP()
    const expirationTime = new Date()
    const expirationInMinutes = 3
    expirationTime.setMinutes(expirationTime.getMinutes() + expirationInMinutes)
    const expirationInMinutesSinceNow = Math.floor(
      (expirationTime - new Date()) / (1000 * 60)
    )

    const hasheOtpCode = bcrypt.hashSync(newCode, saltRounds)

    const newOTP = await OTP.create({
      code: hasheOtpCode,
      userId: newUser.id,
      expiredAt: expirationInMinutesSinceNow,
    })

    const deletionDelay = expirationInMinutesSinceNow * 60 * 1000
    scheduleOtpDeletion(newOTP.id, deletionDelay)

    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject: `OTP from ${AUTH_EMAIL}`,
      html: `
                <p>Hello,</p>
                <p>Your OTP is:</p>
                <p style="color:black;font-size:25px;letter-spacing:2px;"><strong>${newCode}</strong></p>
                <p>It will expire in ${newOTP.expiredAt} minutes.</p>
                <p>Best regards,</p>
                <p>Team c8</p>
            `,
    }
    await sendEmail(mailOptions)

    res.status(200).json({
      status: 'Register successful',
      data: {
        email,
        ...newUser,
      },
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ['User'],
    })

    if (!user) {
      return next(new ApiError('Email not found', 404))
    }
    if (user.verified !== true) {
      return next(new ApiError('User not verified', 401))
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.User.name,
          role: user.User.role,
          email: user.email,
        },
        process.env.JWT_SECRET
      )

      res.status(200).json({
        status: 'Success',
        message: 'Login successful',
        data: token,
      })
    } else {
      return next(new ApiError('Incorrect password', 401))
    }
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const authenticateAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ['User'],
    })

    if (!user) {
      return next(new ApiError('Email not found', 404))
    }

    if (user.User.role !== 'admin') {
      return next(new ApiError('Unauthorized. Only admin can login', 401))
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.User.name,
          role: user.User.role,
          email: user.email,
        },
        process.env.JWT_SECRET
      )

      res.status(200).json({
        status: 'Success',
        message: 'Berhasil login',
        data: token,
      })
    } else {
      return next(new ApiError('Incorrect password', 401))
    }
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const authenticate = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'Success',
      data: {
        id: req.user.id,
        name: req.user.name,
        image: req.user.image,
        phoneNumber: req.user.phoneNumber,
        country: req.user.country,
        city: req.user.city,
      },
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const updateNewPassword = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Password tidak sesuai',
      })
    }

    // Cari data pengguna berdasarkan ID
    const users = await Auth.findOne({
      where: {
        userId,
      },
      include: ['User'],
    })

    if (!users || users.verified !== true) {
      return res.status(401).json({
        status: 'Gagal',
        message: 'Pengguna belum terverifikasi',
      })
    }

    // Hash password baru
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Update password di database Auth
    await Auth.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          userId,
        },
      }
    )

    res.status(200).json({
      status: 'Success',
      message: 'Update Password successful',
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

module.exports = {
  register,
  login,
  authenticate,
  updateNewPassword,
  authenticateAdmin,
}
