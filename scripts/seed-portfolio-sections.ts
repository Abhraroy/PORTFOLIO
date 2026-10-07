import { prisma } from "../lib/prisma";

async function seedPortfolioSections() {
  console.log("No default portfolio sections to seed. Database is clean.");
}

seedPortfolioSections()
  .catch((e) => {
    console.error("Error seeding portfolio sections:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

