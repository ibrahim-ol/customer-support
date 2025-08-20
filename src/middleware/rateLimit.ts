import { rateLimiter } from "hono-rate-limiter";
import { Context } from "hono";

// Helper function to generate IP-based keys
function getClientIP(c: Context): string {
  // Try to get IP from various headers (for proxies)
  const forwarded = c.req.header("x-forwarded-for");
  const realIp = c.req.header("x-real-ip");
  const cfConnectingIp = c.req.header("cf-connecting-ip");

  // Extract IP from forwarded header (first IP in comma-separated list)
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default if no IP is available
  return "unknown";
}

// API Rate Limit - General endpoints
export const apiRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per 15 minutes per IP
  message: "Too many API requests. Please try again later.",
  standardHeaders: "draft-6", // Use RateLimit-* headers
  keyGenerator: (c) => getClientIP(c),
  // Uses MemoryStore by default
});

// Chat Rate Limit - Regular chat interactions
export const chatRateLimit = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 requests per minute per IP
  message:
    "Too many chat requests. Please wait before sending another message.",
  standardHeaders: "draft-6",
  keyGenerator: (c) => getClientIP(c),
});

// Conversation Rate Limit - New conversation creation
export const conversationRateLimit = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // 5 new conversations per minute per IP
  message:
    "Too many new conversations. Please wait before starting another conversation.",
  standardHeaders: "draft-6",
  keyGenerator: (c) => getClientIP(c),
});

// Strict Rate Limit - Expensive AI operations
export const strictRateLimit = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 3, // 3 requests per 5 minutes per IP
  message: "This operation is rate limited. Please try again later.",
  standardHeaders: "draft-6",
  keyGenerator: (c) => getClientIP(c),
});

// Custom rate limiter factory for specific use cases
export function createRateLimit(options: {
  windowMs: number;
  limit: number;
  message?: string;
  keyGenerator?: (c: Context) => string;
}) {
  return rateLimiter({
    windowMs: options.windowMs,
    limit: options.limit,
    message: options.message || "Rate limit exceeded. Please try again later.",
    standardHeaders: "draft-6",
    keyGenerator: options.keyGenerator || getClientIP,
    // Uses MemoryStore by default - no external dependencies required
  });
}
