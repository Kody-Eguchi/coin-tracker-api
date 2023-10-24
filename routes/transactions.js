const router = require("express").Router();
const jwt = require("jsonwebtoken");

module.exports = (prisma) => {
  const secretKey = "your-secret-key";

  // READ ALL TRANSACTIONS
  router.get("/", async (req, res) => {
    try {
      const transactions = await prisma.transaction.findMany({});
      res.json(transactions);
    } catch (error) {
      res.send(error);
    }
  });

  // READ A TRANSACTION BY ID

  // READ TRANSACTIONS BY USER ID
  router.get("/history", async (req, res) => {
    //GET THE JWT TOKEN FROM THE REQUEST HEADERS
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
        // QUERY THE DATABASE WITH USERID
        const transactionHistory = await prisma.transaction.findMany({
          where: {
            user_id: userId,
          },
          include: {
            category: {
              select: {
                category_name: true,
                type: true,
              },
            },
            frequency: {
              select: {
                frequency_name: true,
              },
            },
          },
        });

        // RESPOND WITH TRANSACTION HISTORY
        res.status(200).json(transactionHistory);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        res.status(500).json({ error: "Server error" });
      }
    });
  });

  // READ TRANSACTIONS BY CREATION_DATE

  // CREATE A NEW TRANSACTION
  router.post("/create", async (req, res) => {
    //GET THE JWT TOKEN FROM THE REQUEST HEADERS
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
        const newTransaction = await prisma.transaction.create({
          data: {
            user: {
              connect: {
                user_id: userId,
              },
            },
            transaction_date: new Date(),
            amount: req.body.amount,
            description: req.body.description,
            category: {
              connect: {
                category_id: parseInt(req.body.categoryId),
              },
            },
            frequency: {
              connect: {
                frequency_id: parseInt(req.body.frequencyId),
              },
            },
          },
        });

        res.status(201).json(newTransaction);
      } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Server error" });
      }
    });
  });

  //DELETE A TRANSACTION BY ID
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
        const { transaction_id } = req.body;

        const targetTransaction = await prisma.transaction.findUnique({
          where: {
            transaction_id: transaction_id,
            user_id: userId,
          },
        });

        if (!targetTransaction) {
          return res.status(404).json({ message: "Transaction not found" });
        }

        await prisma.transaction.delete({
          where: {
            transaction_id: transaction_id,
            user_id: userId,
          },
        });

        res.status(201).json({ message: "Transaction deleted successfully" });
      } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  });

  return router;
};
