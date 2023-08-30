const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

//IMPORT PRISMA
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const users = require("./routes/users");

app.get("/", (req, res) => {
  res.send("it works");
});

app.use("/api/users", users(prisma));

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
