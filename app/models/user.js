'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
      User.hasOne(models.Auth, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })

      User.hasOne(models.OTP, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })

      User.hasMany(models.CourseUser, { foreignKey: 'userId' })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM(['admin', 'member']),
        defaultValue: 'member',
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:
          'https://tse2.mm.bing.net/th?id=OIP.U2iQ7wNK6ZzTW_traW_-PQHaHa&pid=Api&P=0&h=180',
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  )
  return User
}
