const { PrismaClient } = require("@prisma/client");
const users = require("./users");
const transactions = require("./transactions");
const categories = require("./categories");
const frequencies = require("./frequencies");
const goals = require("./goals");
const transactionFrequencies = require("./transactionFrequencies");
const transactionCategories = require("./transactionCategories");

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("Clearing existing data...");
  await prisma.transaction_Frequency.deleteMany();
  await prisma.transaction_Category.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.frequency.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding data...");

  // CATEGORY DATA
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // FREQUENCY DATA
  for (const frequency of frequencies) {
    await prisma.frequency.create({
      data: frequency,
    });
  }

  // USER DATA
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  // TRANSACTION DATA
  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  // GOAL DATA
  for (const goal of goals) {
    await prisma.goal.create({
      data: goal,
    });
  }

  // TRANSACTION FREQUENCY DATA
  for (const transactionFrequency of transactionFrequencies) {
    await prisma.transaction_Frequency.create({
      data: transactionFrequency,
    });
  }

  // TRANSACTION CATEGORY DATA
  for (const transactionCategory of transactionCategories) {
    await prisma.transaction_Category.create({
      data: transactionCategory,
    });
  }

  console.log("🌱🌱 Seeding Success 🌱🌱");
}

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
