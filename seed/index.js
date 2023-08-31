const { PrismaClient } = require("@prisma/client");
const users = require("./users");

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("Clearing existing data...");
  await prisma.user.deleteMany();
  console.log("Seeding data...");
  for (const user of users) {
    await prisma.user.create({
      data: user,
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
