const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");

//IMPORT PRISMA
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CORS
const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

const users = require("./routes/users");
const login = require("./routes/login");

app.get("/", (req, res) => {
  res.send("it works");
});

app.use("/api/users", users(prisma));
app.use("/api/login", login(prisma));

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
