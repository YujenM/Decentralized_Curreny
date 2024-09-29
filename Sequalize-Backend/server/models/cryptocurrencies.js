'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cryptocurrencies extends Model {
    static associate(models) {
      // define association here
    }
  }
  Cryptocurrencies.init({
    cryptoName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    cryptoSymbol: {
      type:DataTypes.STRING,
      allowNull:false
    },
    cryptoImage: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Cryptocurrencies',
    tableName: 'Cryptocurrencies'
  });
  return Cryptocurrencies;
};