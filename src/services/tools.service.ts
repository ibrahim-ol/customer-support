import { tool } from "ai";
import z from "zod";
import { db } from "../db/index.ts";
import { product } from "../db/schema.ts";
import { like, or } from "drizzle-orm";

export const getProducts = tool({
  description:
    "Get the list of available services and products offered by the company. Use this when customers ask about services, pricing, or what the company offers. Format the response clearly with service names, descriptions, and prices in a structured way for easy reading.",
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
      console.log("Tool is being called", query);
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
      }
      if (!products || products.length === 0) {
        // Get all products
        products = await db.select().from(product);
      }

      return {
        success: true,
        products: products.map((p) => ({
          name: p.name,
          price: `€${p.price.toLocaleString()}`,
          description: p.description,
        })),
        message: `Found ${products.length} service(s). Present these in a clear, structured format with service names, descriptions, and pricing.`,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch products",
        products: [],
        message:
          "Unable to retrieve services at this time. Please try again later.",
      };
    }
  },
});
