import { Hono } from "hono";
import { serve } from "@hono/node-server";
import {
  chatRateLimit,
  conversationRateLimit,
  apiRateLimit,
  strictRateLimit,
  createRateLimit,
} from "./src/middleware/rateLimit.ts";

// Create a test app to verify rate limiting with hono-rate-limiter
const testApp = new Hono();

// Test endpoints with different rate limits
testApp.get("/test/api", apiRateLimit, (c) => {
  return c.json({
    message: "API endpoint hit",
    timestamp: new Date().toISOString(),
    ip: c.req.header("x-forwarded-for") || "unknown",
  });
});

testApp.post("/test/chat", chatRateLimit, (c) => {
  return c.json({
    message: "Chat endpoint hit",
    timestamp: new Date().toISOString(),
    ip: c.req.header("x-forwarded-for") || "unknown",
  });
});

testApp.post("/test/conversation", conversationRateLimit, (c) => {
  return c.json({
    message: "Conversation endpoint hit",
    timestamp: new Date().toISOString(),
    ip: c.req.header("x-forwarded-for") || "unknown",
  });
});

testApp.post("/test/strict", strictRateLimit, (c) => {
  return c.json({
    message: "Strict endpoint hit",
    timestamp: new Date().toISOString(),
    ip: c.req.header("x-forwarded-for") || "unknown",
  });
});

// Test custom rate limiter
const customLimit = createRateLimit({
  windowMs: 30 * 1000, // 30 seconds
  limit: 2, // 2 requests per 30 seconds
  message: "Custom rate limit exceeded!",
});

testApp.get("/test/custom", customLimit, (c) => {
  return c.json({
    message: "Custom rate limit endpoint hit",
    timestamp: new Date().toISOString(),
    ip: c.req.header("x-forwarded-for") || "unknown",
  });
});

// Health check endpoint (no rate limiting)
testApp.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Test function to make multiple requests
async function testRateLimit(
  endpoint: string,
  method: string = "GET",
  maxRequests: number = 15,
  ip: string = "127.0.0.1",
) {
  console.log(
    `\n🧪 Testing rate limit for ${method} ${endpoint} with IP: ${ip}`,
  );
  console.log(`Making ${maxRequests} requests...`);

  const results = [];
  const baseUrl = "http://localhost:3001";

  for (let i = 1; i <= maxRequests; i++) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": ip,
        },
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      // Extract rate limit headers (hono-rate-limiter uses RateLimit-* headers)
      const rateLimitHeaders = {
        limit: response.headers.get("RateLimit-Limit"),
        remaining: response.headers.get("RateLimit-Remaining"),
        reset: response.headers.get("RateLimit-Reset"),
        retryAfter: response.headers.get("Retry-After"),
        // Fallback to X-RateLimit-* headers if available
        xLimit: response.headers.get("X-RateLimit-Limit"),
        xRemaining: response.headers.get("X-RateLimit-Remaining"),
        xReset: response.headers.get("X-RateLimit-Reset"),
      };

      results.push({
        request: i,
        status: response.status,
        data,
        headers: rateLimitHeaders,
      });

      const remaining =
        rateLimitHeaders.remaining || rateLimitHeaders.xRemaining || "N/A";
      console.log(`Request ${i}: ${response.status} - Remaining: ${remaining}`);

      if (response.status === 429) {
        const retryAfter = rateLimitHeaders.retryAfter;
        console.log(`❌ Rate limited! ${data.message || "Too many requests"}`);
        if (retryAfter) {
          console.log(`   Retry after: ${retryAfter}s`);
        }
      }
    } catch (error) {
      console.error(
        `Request ${i} failed:`,
        error instanceof Error ? error.message : String(error),
      );
    }

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

// Test with different rate limits
async function runAllTests() {
  console.log("🚀 Starting hono-rate-limiter tests...");
  console.log("Starting test server on port 3001...");

  const server = serve({ fetch: testApp.fetch, port: 3001 });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Test health endpoint (no rate limiting)
    console.log("\n📊 Testing health endpoint (no rate limiting)...");
    await testRateLimit("/health", "GET", 3);

    // Test API rate limit (100 requests per 15 minutes)
    console.log("\n📊 Testing API rate limit...");
    await testRateLimit("/test/api", "GET", 5);

    // Wait between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test chat rate limit (10 requests per minute)
    console.log("\n📊 Testing chat rate limit...");
    await testRateLimit("/test/chat", "POST", 12);

    // Wait between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test conversation rate limit (5 requests per minute)
    console.log("\n📊 Testing conversation rate limit...");
    await testRateLimit("/test/conversation", "POST", 7);

    // Wait between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test strict rate limit (3 requests per 5 minutes)
    console.log("\n📊 Testing strict rate limit...");
    await testRateLimit("/test/strict", "POST", 5);

    // Wait between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test custom rate limit (2 requests per 30 seconds)
    console.log("\n📊 Testing custom rate limit...");
    await testRateLimit("/test/custom", "GET", 4);

    console.log("\n✅ All basic tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    server.close();
    console.log("🛑 Test server stopped");
  }
}

// Test with different IPs to verify IP-based rate limiting
async function testDifferentIPs() {
  console.log("\n🌐 Testing rate limiting with different IPs...");

  const server = serve({ fetch: testApp.fetch, port: 3001 });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const ips = ["192.168.1.1", "192.168.1.2", "192.168.1.3"];

    for (const ip of ips) {
      console.log(`\n🔍 Testing with IP: ${ip}`);
      await testRateLimit("/test/strict", "POST", 4, ip);

      // Small delay between IP tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("\n✅ Different IP tests completed!");
  } catch (error) {
    console.error("❌ IP test failed:", error);
  } finally {
    server.close();
    console.log("🛑 Test server stopped");
  }
}

// Test rate limit headers
async function testRateLimitHeaders() {
  console.log("\n📋 Testing rate limit headers...");

  const server = serve({ fetch: testApp.fetch, port: 3001 });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const response = await fetch("http://localhost:3001/test/custom", {
      headers: {
        "X-Forwarded-For": "192.168.1.100",
      },
    });

    console.log("\n📊 Rate Limit Headers:");
    console.log(`Status: ${response.status}`);
    console.log(`RateLimit-Limit: ${response.headers.get("RateLimit-Limit")}`);
    console.log(
      `RateLimit-Remaining: ${response.headers.get("RateLimit-Remaining")}`,
    );
    console.log(`RateLimit-Reset: ${response.headers.get("RateLimit-Reset")}`);

    // Check for fallback headers
    console.log(
      `X-RateLimit-Limit: ${response.headers.get("X-RateLimit-Limit")}`,
    );
    console.log(
      `X-RateLimit-Remaining: ${response.headers.get("X-RateLimit-Remaining")}`,
    );
    console.log(
      `X-RateLimit-Reset: ${response.headers.get("X-RateLimit-Reset")}`,
    );

    const data = await response.json();
    console.log("Response body:", data);
  } catch (error) {
    console.error("❌ Headers test failed:", error);
  } finally {
    server.close();
    console.log("🛑 Test server stopped");
  }
}

// Performance test
async function performanceTest() {
  console.log("\n⚡ Running performance test...");

  const server = serve({ fetch: testApp.fetch, port: 3001 });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const startTime = Date.now();
    const promises = [];

    // Make 50 concurrent requests from different IPs
    for (let i = 0; i < 50; i++) {
      const promise = fetch("http://localhost:3001/test/api", {
        headers: {
          "X-Forwarded-For": `192.168.1.${i % 10}`,
        },
      });
      promises.push(promise);
    }

    const responses = await Promise.allSettled(promises);
    const endTime = Date.now();

    const successful = responses.filter(
      (r) => r.status === "fulfilled" && r.value.status === 200,
    ).length;
    const rateLimited = responses.filter(
      (r) => r.status === "fulfilled" && r.value.status === 429,
    ).length;
    const failed = responses.filter((r) => r.status === "rejected").length;

    console.log(`\n📈 Performance Results:`);
    console.log(`Total time: ${endTime - startTime}ms`);
    console.log(`Successful requests: ${successful}`);
    console.log(`Rate limited: ${rateLimited}`);
    console.log(`Failed requests: ${failed}`);
  } catch (error) {
    console.error("❌ Performance test failed:", error);
  } finally {
    server.close();
    console.log("🛑 Test server stopped");
  }
}

// Main test runner
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--all")) {
    await runAllTests();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await testDifferentIPs();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await testRateLimitHeaders();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await performanceTest();
  } else if (args.includes("--ips")) {
    await testDifferentIPs();
  } else if (args.includes("--headers")) {
    await testRateLimitHeaders();
  } else if (args.includes("--performance")) {
    await performanceTest();
  } else {
    await runAllTests();
  }
}

// Run tests if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      console.log("\n🎉 All tests completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Test suite failed:", error);
      process.exit(1);
    });
}

export { testApp, testRateLimit, runAllTests, testDifferentIPs };
