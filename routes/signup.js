const router = require("express").Router();
const bcrypt = require("bcrypt");

module.exports = (prisma) => {
  router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: encryptedPassword,
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};
