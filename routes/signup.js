const router = require("express").Router();
const { Prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (prisma) => {
  return router;
};
