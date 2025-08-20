import { db } from "./index.ts";
import { product } from "./schema.ts";
import products from "../data/products.json" with { type: "json" };

async function seedProducts() {
  try {
    console.log("🌱 Seeding products...");

    // Clear existing products
    await db.delete(product);
    console.log("  ✓ Cleared existing products");

    // Insert new products from JSON
    const insertedProducts = await db
      .insert(product)
      .values(
        products.map((p) => ({
          name: p.name,
          price: p.price,
          description: p.description,
        })),
      )
      .returning();

    console.log(`  ✓ Inserted ${insertedProducts.length} products`);
    console.log("🎉 Product seeding completed successfully!");

    // Log inserted products for verification
    insertedProducts.forEach((p, index) => {
      console.log(`    ${index + 1}. ${p.name} - $${p.price}`);
    });
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts()
    .then(() => {
      console.log("Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding process failed:", error);
      process.exit(1);
    });
}

export { seedProducts };
