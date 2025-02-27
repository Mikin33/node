const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs"); // ✅ Optional: Hash passwords before inserting

const filePath = path.join(__dirname, "../data/users.json");
let usersData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// ✅ Ensure createdAt & updatedAt are included (for PostgreSQL)
usersData = usersData.map(user => ({
  ...user
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", usersData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
