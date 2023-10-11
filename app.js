const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

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
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  maxAge: 3600, // 1 hour (in seconds)
};

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());

const users = require("./routes/users");
const login = require("./routes/login");
const profile = require("./routes/userProfile");
const transactions = require("./routes/transactions");
const goal = require("./routes/goal");
const signup = require("./routes/signup");

app.get("/", (req, res) => {
  res.send("it works");
});

app.use("/api/users", users(prisma));
app.use("/api/login", login(prisma));
app.use("/api/profile", profile(prisma));
app.use("/api/transactions", transactions(prisma));
app.use("/api/goal", goal(prisma));
app.use("/apo/signup", signup(prisma));

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
