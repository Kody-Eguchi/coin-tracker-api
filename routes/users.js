const router = require("express").Router();

module.exports = (prisma) => {
  // READ
  router.get("/", async (req, res) => {
    try {
      const users = await prisma.user.findMany({});
      res.json(users);
    } catch (error) {
      res.send(error);
    }
  });

  return router;
};
