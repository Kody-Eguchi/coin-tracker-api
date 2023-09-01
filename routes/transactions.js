const router = require("express").Router();

module.exports = (prisma) => {
  // READ ALL TRANSACTIONS
  router.get("/", async (req, res) => {
    try {
      const transactions = await prisma.transactions.findMany({});
      res.json(users);
    } catch (error) {
      res.send(error);
    }
  });

  // READ A TRANSACTION BY ID

  // READ TRANSACTIONS BY USER ID

  // READ TRANSACTIONS BY CREATION_DATE

  // READ TRANSACTIONS BY

  return router;
};
