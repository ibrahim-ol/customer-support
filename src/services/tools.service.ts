import { tool } from "ai";
import z from "zod";
import { db } from "../db/index.ts";
import { product } from "../db/schema.ts";
import { like, or } from "drizzle-orm";

export const getProducts = tool({
  description:
    "Get the list of available services and products offered by the company. Use this when customers ask about services, pricing, or what the company offers.",
  parameters: z.object({
    query: z
      .string()
      .optional()
      .describe(
        "Optional search query to filter products by name or description",
      ),
  }),
  execute: async ({ query }) => {
    try {
      console.log("Tool is being called");
      let products;
      if (query) {
        // Search products by name or description containing the query
        products = await db
          .select()
          .from(product)
          .where(
            or(
              like(product.name, `%${query}%`),
              like(product.description, `%${query}%`),
            ),
          );
      } else {
        // Get all products
        products = await db.select().from(product);
      }

      return {
        success: true,
        products: products.map((p) => ({
          name: p.name,
          price: p.price,
          description: p.description,
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch products",
        products: [],
      };
    }
  },
});
