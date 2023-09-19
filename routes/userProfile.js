const router = require("express").Router();
const jwt = require("jsonwebtoken");

module.exports = (prisma) => {
  // GET USER INFORMATION BY JTW TOKEN
  // Secret key for JWT token verification
  const secretKey = "your-secret-key"; // Replace with your actual secret key

  router.get("/", async (req, res) => {
    // Get the JWT token from the request headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    // Verify and decode the token
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        // Handle token verification error
        return res.status(401).json({ error: "Invalid token" });
      }

      // Extract the userId from the decoded token
      const userId = decoded.userId;

      try {
        // Query your database using Prisma to fetch the user's information based on userId
        const user = await prisma.user.findFirst({
          where: {
            user_id: userId,
          },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Respond with the user's information
        res.status(200).json(user);
      } catch (error) {
        console.error("Error", error);
        res.status(500).json({ error: "Server error" });
      }
    });
  });
  return router;
};
