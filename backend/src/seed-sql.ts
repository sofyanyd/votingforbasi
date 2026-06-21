import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const sqlPath = path.resolve("../forbasi.sql");
  console.log("Reading SQL file from:", sqlPath);
  const sql = fs.readFileSync(sqlPath, "utf-8");

  console.log("Dropping old tables...");
  await prisma.$executeRawUnsafe(`
    DROP TABLE IF EXISTS "Event", "Pembicara", "CategoryEvent", "User", "users", "categories", "finalists", "tickets", "votes" CASCADE;
  `);

  console.log("Parsing and executing SQL schema and seed data statement by statement...");
  
  // Split sql by semicolon
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => {
      if (!s) return false;
      const lines = s.split("\n").map(l => l.trim());
      const nonCommentLines = lines.filter(l => l && !l.startsWith("--"));
      return nonCommentLines.length > 0;
    });

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    try {
      await prisma.$executeRawUnsafe(stmt);
    } catch (err) {
      console.error(`Failed to execute statement:`, stmt);
      throw err;
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
