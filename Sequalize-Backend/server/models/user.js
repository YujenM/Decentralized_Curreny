const bcrypt = require('bcrypt');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (u) => {
        const salt = bcrypt.genSaltSync(8);
        u.password = bcrypt.hashSync(u.password, salt);
      },
    },
    
  });
  
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  return User;
};