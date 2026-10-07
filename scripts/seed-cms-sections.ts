import { prisma } from "../lib/prisma";

async function main() {
  console.log("No default seed data to populate. Database is clean.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

