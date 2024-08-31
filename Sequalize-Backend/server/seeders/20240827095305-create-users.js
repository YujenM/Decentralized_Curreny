'use strict';
const moment = require('moment');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(8);

module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.bulkInsert('users', [
      {
      fullName: 'Yujen Maharjan',
      email: 'maharjanyuzen@gmail.com',
      password: await bcrypt.hash('iambatman@123', salt),
      phoneNumber: '9847493443',
      createdAt: moment().format('YYYY-MM-DD hh:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD hh:mm:ss')
    },
    {
      fullName:'Aadarsha Shrestha',
      email: 'aadarsha@gmail.com',
      password: await bcrypt.hash('iamrobin@gmail.com',salt),
      phoneNumber: '981111111',
      createdAt: moment().format('YYYY-MM-DD hh:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD hh:mm:ss')
    }
  ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null , {});
  }
};
