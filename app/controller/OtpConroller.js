const generatedOTP = require('../../utils/generatedOTP')
const sendEmail = require('../../utils/sendEmail')

const { Auth, User, OTP } = require('../models')
const { AUTH_EMAIL } = process.env
const ApiError = require('../../utils/apiError')
const scheduleOtpDeletion = require('../../utils/scheduleDeletion')
const bcrypt = require('bcrypt')

const verifyOTP = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { code } = req.body

    // Cari data pengguna berdasarkan ID
    const userOtp = await OTP.findOne({
      where: {
        userId,
      },
      include: ['User'],
    })

    // Cek apakah pengguna ditemukan dan OTP sesuai
    if (!userOtp) {
      return next(new ApiError('OTP code has expired', 401))
    }

    if (!bcrypt.compareSync(String(code), String(userOtp.code))) {
      return next(new ApiError('Invalid OTP', 403))
    }

    await Auth.update(
      {
        verified: true,
      },
      {
        where: {
          userId,
        },
      }
    )

    // Verifikasi berhasil, hapus data OTP dari database
    await OTP.destroy({
      where: {
        userId: userOtp.User.id,
      },
    })

    res.status(200).json({
      status: 'Success',
      message: 'OTP verification successful',
    })
  } catch (err) {
    next(new ApiError(err.message, 500))
  }
}

const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ['User'],
    })

    if (!user) {
      return next(new ApiError('User not found', 404))
    }

    await OTP.destroy({
      where: {
        userId: user.User.id,
      },
    })

    const newCode = await generatedOTP()
    const expirationTime = new Date()
    const expirationInMinutes = 3
    expirationTime.setMinutes(expirationTime.getMinutes() + expirationInMinutes)
    const expirationInMinutesSinceNow = Math.floor(
      (expirationTime - new Date()) / (1000 * 60)
    )

    const saltRounds = 10
    const hasheOtpCode = bcrypt.hashSync(newCode, saltRounds)

    const newOtpRequest = await OTP.create({
      email,
      code: hasheOtpCode,
      userId: user.User.id,
      expiredAt: expirationInMinutesSinceNow,
    })

    const deletionDelay = expirationInMinutesSinceNow * 60 * 1000
    scheduleOtpDeletion(newOtpRequest.id, deletionDelay)

    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject: `OTP from ${AUTH_EMAIL}`,
      html: `
                <p>Hello,</p>
                <p>Your OTP is:</p>
                <p style="color:black;font-size:25px;letter-spacing:2px;"><strong>${newCode}</strong></p>
                <p>It will expire in ${newOtpRequest.expiredAt} minutes.</p>
                <p>Best regards,</p>
                <p>Team c8</p>
            `,
    }
    await sendEmail(mailOptions)

    res.status(200).json({
      status: 'Success',
      data: {
        newOtpRequest,
        message: 'OTP sent successfully',
      },
    })
  } catch (err) {
    next(new ApiError(err.message, 400))
  }
}

module.exports = { verifyOTP, sendOtp }
