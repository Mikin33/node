const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/users.json");
const productsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", productsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
