import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Admin password: '12345678'
  await prisma.users.update({
    where: { id: 1 },
    data: { password_hash: "$2b$10$Ki3//wP84SHb30WD1973zus4Urq69ex0C11AhEW8uV4UeuUzttc7S" }
  });
  // Voter password: '24090027'
  await prisma.users.update({
    where: { id: 2 },
    data: { password_hash: "$2b$10$6f1a2nfWxycrJkjhnrZZf.sPq.MKpfyi1VINL.ZCJFD3wFIZmVNLi" }
  });
  console.log("Passwords updated successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
