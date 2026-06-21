import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    console.log("Resetting auto-increment sequences in PostgreSQL...");
    const tables = ['categories', 'users', 'finalists', 'tickets', 'votes'];
    for (const table of tables) {
        try {
            // postgresql setval resets sequence to max(id)
            await prisma.$executeRawUnsafe(`
        SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce(max(id), 1)) FROM "${table}";
      `);
            console.log(`Successfully reset sequence for table: ${table}`);
        }
        catch (e) {
            console.error(`Failed to reset sequence for table ${table}:`, e);
        }
    }
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
