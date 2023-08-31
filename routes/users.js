const router = require("express").Router();

module.exports = (prisma) => {
  // READ ALL USERS
  router.get("/", async (req, res) => {
    try {
      const users = await prisma.user.findMany({});
      res.json(users);
    } catch (error) {
      res.send(error);
    }
  });

  // READ A USER BY ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(id),
        },
      });
      res.json(user);
    } catch (error) {
      res.send(error);
    }
  });

  // CREATE A NEW USER
  // LATER: PREVENT DUPLICATION
  router.post("/", async (req, res) => {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.json(user);
  });

  //UPDATE A USER INFORMATION
  router.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const user = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });
      res.json(user);
    } catch (error) {
      res.send(error);
    }
  });

  //DELETE A USER
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      res.json(user);
    } catch (error) {
      res.send(error);
    }
  });

  return router;
};
