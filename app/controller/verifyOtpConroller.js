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

    // Cari data pengguna berdasarkan alamat email
    const userOtp = await OTP.findOne({
      where: {
        userId,
      },
      include: ['User'],
    })

    // Cek apakah pengguna ditemukan dan OTP sesuai
    if (!userOtp) {
      return next(new ApiError('expired OTP', 400))
    }

    if (!bcrypt.compareSync(String(code), String(userOtp.code))) {
      return next(new ApiError('Invalid OTP', 400))
    }

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
        userId: user.id,
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
                <div style="text-align: center; background-color: #ecf0f1; padding: 20px; border-radius: 10px;">
                  <p>Your OTP is:</p>
                  <p style="color: #3498db; font-size: 35px; letter-spacing: 2px; font-weight: bold; background-color: #f2f2f2; padding: 10px; border-radius: 5px; border: 2px solid #3498db;">${newCode}</p>
                  <p style="text-align: center; color: #7f8c8d;">It will expire in ${newOtpRequest.expiredAt} minutes.</p>
                </div>
                <p style="text-align: center; color: #2c3e50; font-weight: bold;">Best regards,</p>
                <p style="text-align: center; color: #2c3e50; font-weight: bold;">Team c8</p>
            `,
    }
    await sendEmail(mailOptions)

    res.status(200).json({
      status: 'Success',
      data: {
        newOtpRequest,
      },
    })
  } catch (err) {
    next(new ApiError(err.message, 400))
  }
}

module.exports = { verifyOTP, sendOtp }
