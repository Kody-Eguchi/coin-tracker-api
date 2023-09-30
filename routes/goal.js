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

  // CREATE A NEW GOAL
  router.post("/", async (req, res) => {
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
        const { description, goal_amount, target_date } = req.body;
        const midnightTargetDate = new Date(target_date);
        midnightTargetDate.setUTCHours(0, 0, 0, 0);
        const goal = await prisma.goal.create({
          data: {
            creation_date: new Date(),
            description,
            goal_amount,
            target_date: midnightTargetDate,
            user_id: userId,
          },
        });

        res.status(201).json(goal);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to create goal" });
      }
    });
  });

  // DELETE A GOAL BY ID
  router.delete("/delete", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    //VERIFY AND DECODE THE TOKEN
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        // VERIFICATION ERROR HANDLING
        return res.status(401).json({ error: "Invalid token" });
      }

      // EXTRACT THE USERID FROM THE DECODED TOKEN
      const userId = decoded.userId;

      try {
        const { goal_id } = req.body;

        const targetGoal = await prisma.goal.findUnique({
          where: {
            goal_id: goal_id,
            user_id: userId,
          },
        });

        if (!targetGoal) {
          return res.status(404).json({ message: "Goal not found" });
        }

        await prisma.goal.delete({
          where: {
            transaction_id: transaction_id,
            user_id: userId,
          },
        });
      } catch (error) {
        console.error("Error deleting goal:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  });

  return router;
};
