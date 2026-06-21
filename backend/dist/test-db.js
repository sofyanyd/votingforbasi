import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    try {
        console.log("Testing connection and querying finalists table...");
        const finalists = await prisma.finalists.findMany();
        console.log("Query success! Count:", finalists.length);
        console.log("First row preview:", finalists[0]);
    }
    catch (error) {
        console.error("Query failed!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Full Error Details:", JSON.stringify(error, null, 2));
    }
}
main()
    .finally(() => prisma.$disconnect());
