const bcrypt = require("bcrypt");

const users = [
  {
    username: "Koji",
    email: "koji@example.com",
    plainTextPassword: "123",
  },
  {
    username: "Bob",
    email: "bob@example.com",
    plainTextPassword: "123",
  },
  {
    username: "Ryan",
    email: "ryan@example.com",
    plainTextPassword: "123",
  },
];

const saltRounds = 10;

for (const user of users) {
  const hashedPassword = bcrypt.hashSync(user.plainTextPassword, saltRounds);
  user.password = hashedPassword;
  delete user.plainTextPassword;
}

module.exports = users;
