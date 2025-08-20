import { seedProducts } from "./seed-products.ts";
import { seedConversations } from "./seed-conversations.ts";

async function runSeeds() {
  try {
    console.log("🚀 Starting database seeding...\n");

    // Run product seeding
    await seedProducts();

    console.log("");

    // Run conversation seeding
    await seedConversations();

    console.log("\n✅ All seeding completed successfully!");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run seeds if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeds()
    .then(() => {
      console.log("Database seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database seeding process failed:", error);
      process.exit(1);
    });
}

export { runSeeds };
