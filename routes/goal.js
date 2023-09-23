const router = require("express").Router();
const jwt = require("jsonwebtoken");

module.exports = (prisma) => {
  const secretKey = "your-secret-key";
  // GET ALL GOALS BY USER ID
  router.get("/", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        // VERIFICATION ERROR HANDLING
        return res.status(401).json({ error: "Invalid token" });
      }

      // EXTRACT THE USERID FROM THE DECODED TOKEN
      const userId = decoded.userId;

      try {
        // QUERY THE DATABASE WITH USERID
        const goals = await prisma.goal.findMany({
          where: {
            user_id: userId,
          },
        });

        // RESPOND WITH TRANSACTION HISTORY
        res.status(200).json(goals);
      } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ error: "Server error" });
      }
    });
  });

  return router;
};
