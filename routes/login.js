const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (prisma) => {
  // RETURN USER INFORMATION UPON AUTHENTICATION
  router.post("/", async (req, res) => {
    const { email, password } = req.body;
    // FIND THE USER BY EMAIL
    try {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      console.log(user, "🚨");
      // if (!user || !(await bcrypt.compare(password, user.password))) {
      //   return res.status(401).json({ error: "Invalid credentials" });
      // }

      const token = jwt.sign({ userId: user.id }, "your-secret-key", {
        expiresIn: "1h", // Token expiration time
      });

      //SET THE TOKEN AS AN HTTP ONLY COOKIE
      res.cookie("token", token, {
        // httpOnly: true,
        // domain: "http://localhost:3000",
        // secure: true,
        // sameSite: "None",
      });

      console.log(token, "🔑");
      // Respond with the token
      res.status(200).json({ token });
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};
