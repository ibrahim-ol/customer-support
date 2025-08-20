# Rate Limiting Implementation

This document describes the rate limiting implementation for the AI Customer Support application using the official `hono-rate-limiter` package with memory store.

## Overview

Rate limiting is implemented using the `hono-rate-limiter` package, which provides robust rate limiting middleware for Hono applications. This helps prevent abuse, protects against DDoS attacks, and ensures fair usage of AI-powered chat functionality.

## Features

- **Memory-based storage** with automatic cleanup
- **IP-based tracking** with proxy header support
- **Standard HTTP headers** (`RateLimit-*` format)
- **Configurable rate limits** per endpoint
- **Custom error messages** per rate limiter
- **Zero external dependencies** (uses built-in MemoryStore)

## Installation

The rate limiting package is already installed:

```bash
yarn add hono-rate-limiter
```

## Rate Limit Tiers

### API Rate Limit
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Usage**: General API endpoints, data retrieval
- **Headers**: `RateLimit-*` (draft-6 standard)

### Chat Rate Limit  
- **Window**: 1 minute
- **Limit**: 10 requests per IP
- **Usage**: Regular chat interactions (non-AI)
- **Purpose**: Prevent chat message spam

### Conversation Rate Limit
- **Window**: 1 minute  
- **Limit**: 5 requests per IP
- **Usage**: New conversation creation
- **Purpose**: Prevent conversation flooding

### Strict Rate Limit
- **Window**: 5 minutes
- **Limit**: 3 requests per IP  
- **Usage**: AI-powered chat endpoints (expensive operations)
- **Purpose**: Protect AI API usage and costs

## Implementation

### Middleware Usage

```typescript
import { rateLimiter } from "hono-rate-limiter";

// Basic usage
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  limit: 100,                  // 100 requests per window
  message: "Too many requests",
  standardHeaders: "draft-6",   // RateLimit-* headers
  keyGenerator: (c) => getClientIP(c),
  // Uses MemoryStore by default
});

app.use("/api/*", limiter);
```

### Applied Endpoints

| Endpoint | Method | Rate Limit | Purpose |
|----------|--------|------------|---------|
| `POST /chat/` | POST | Strict (3/5min) | AI chat generation |
| `POST /chat/new` | POST | Conversation (5/min) | New conversations |
| `GET /chat/` | GET | API (100/15min) | List conversations |
| `GET /chat/:id` | GET | API (100/15min) | Get conversation |
| `GET /chat/:id/analytics` | GET | API (100/15min) | Analytics data |
| `GET /chat/:id/mood-history` | GET | API (100/15min) | Mood history |
| Global `*` | ALL | API (100/15min) | All requests |

### Pre-configured Rate Limiters

```typescript
// Available rate limiters
import {
  apiRateLimit,        // 100/15min - General API
  chatRateLimit,       // 10/1min - Chat messages  
  conversationRateLimit, // 5/1min - New conversations
  strictRateLimit,     // 3/5min - AI operations
  createRateLimit      // Custom factory function
} from './middleware/rateLimit';
```

### Custom Rate Limiter Factory

```typescript
const customLimit = createRateLimit({
  windowMs: 30 * 1000,    // 30 seconds
  limit: 5,               // 5 requests per 30 seconds
  message: "Custom limit exceeded",
  keyGenerator: (c) => c.get('userId') || getClientIP(c)
});
```

## Headers

The middleware sets standard rate limiting headers following the draft-6 specification:

- `RateLimit-Limit`: Maximum requests allowed in window
- `RateLimit-Remaining`: Requests remaining in current window  
- `RateLimit-Reset`: Unix timestamp when window resets
- `Retry-After`: Seconds to wait before retry (429 only)

### Example Response Headers
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1640995200
```

## Error Response

When rate limited (HTTP 429):

```json
{
  "message": "Too many requests, please try again later."
}
```

The exact message varies by rate limiter configuration.

## IP Detection

The middleware detects client IPs from multiple sources in order:

1. `x-forwarded-for` header (proxy/load balancer)
2. `x-real-ip` header (nginx reverse proxy)  
3. `cf-connecting-ip` header (Cloudflare)
4. Fallback to "unknown"

```typescript
function getClientIP(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for");
  const realIp = c.req.header("x-real-ip");
  const cfConnectingIp = c.req.header("cf-connecting-ip");

  // Extract first IP from comma-separated list
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIp) return realIp;
  if (cfConnectingIp) return cfConnectingIp;
  
  return "unknown";
}
```

## Testing

### Available Test Scripts

```bash
# Basic rate limit tests
npm run test:rate-limit

# Comprehensive test suite
npm run test:rate-limit:all

# Test different IP addresses
npm run test:rate-limit:ips

# Test rate limit headers
npm run test:rate-limit:headers

# Performance testing
npm run test:rate-limit:performance
```

### Test Endpoints

The test server includes endpoints for each rate limiter:

- `GET /test/api` - API rate limit
- `POST /test/chat` - Chat rate limit
- `POST /test/conversation` - Conversation rate limit
- `POST /test/strict` - Strict rate limit
- `GET /test/custom` - Custom rate limit (2/30s)
- `GET /health` - No rate limiting

### Manual Testing

```bash
# Test API endpoint
curl -X GET http://localhost:3001/test/api \
  -H "X-Forwarded-For: 192.168.1.1"

# Check rate limit headers
curl -I -X GET http://localhost:3001/test/api \
  -H "X-Forwarded-For: 192.168.1.1"
```

## Production Considerations

### Memory Store Characteristics

- **Pros**: No external dependencies, fast access, simple deployment
- **Cons**: Not shared across multiple instances, lost on restart
- **Suitable for**: Single-instance deployments, development, basic abuse prevention

### Scaling Options

For multi-instance production deployments, consider these stores:

```typescript
// Redis store (recommended for production)
import { RedisStore } from "@hono-rate-limiter/redis";

const redisStore = new RedisStore({
  client: redisClient
});

const limiter = rateLimiter({
  // ... other options
  store: redisStore
});
```

### Monitoring

Monitor rate limiting effectiveness:

```typescript
// Log rate limit hits
app.onError((err, c) => {
  if (c.res.status === 429) {
    console.log(`Rate limit hit: ${getClientIP(c)}`);
  }
  return c.text("Error", 500);
});
```

## Security Benefits

1. **DDoS Protection**: Prevents overwhelming the server
2. **Cost Control**: Limits expensive AI API calls  
3. **Fair Usage**: Ensures resources available for all users
4. **Abuse Prevention**: Stops automated attacks and scraping

## Frontend Integration

### Handling Rate Limits

```javascript
async function sendChatMessage(message) {
  try {
    const response = await fetch('/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    // Check rate limit headers
    const limit = response.headers.get('RateLimit-Limit');
    const remaining = response.headers.get('RateLimit-Remaining');
    const reset = response.headers.get('RateLimit-Reset');
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      showRateLimitMessage(`Please wait ${retryAfter} seconds before trying again`);
      return;
    }
    
    // Handle successful response
    const data = await response.json();
    displayMessage(data);
    
  } catch (error) {
    console.error('Chat error:', error);
  }
}
```

### Rate Limit UI Indicators

```javascript
// Show remaining requests to user
function updateRateLimitUI(remaining, limit) {
  const percentage = (remaining / limit) * 100;
  const indicator = document.getElementById('rate-limit-indicator');
  
  if (percentage < 20) {
    indicator.className = 'rate-limit-warning';
    indicator.textContent = `${remaining}/${limit} requests remaining`;
  } else {
    indicator.className = 'rate-limit-normal';
  }
}
```

## Configuration Examples

### User-based Rate Limiting

```typescript
// Rate limit per authenticated user instead of IP
const userRateLimit = rateLimiter({
  windowMs: 60 * 1000,
  limit: 20,
  keyGenerator: (c) => {
    const userId = c.get('userId');
    return userId || getClientIP(c);
  },
  message: 'User rate limit exceeded'
});
```

### Path-based Rate Limiting

```typescript
// Different limits for different endpoints
const pathRateLimit = rateLimiter({
  windowMs: 60 * 1000,
  limit: (c) => {
    const path = c.req.path;
    if (path.startsWith('/api/admin')) return 5;
    if (path.startsWith('/api/chat')) return 10;
    return 50;
  },
  keyGenerator: (c) => getClientIP(c)
});
```

## Troubleshooting

### Common Issues

1. **Rate limits too strict**: Increase `limit` value
2. **Headers not showing**: Check `standardHeaders` option
3. **Different IPs not working**: Verify proxy headers configuration
4. **Memory usage growing**: Ensure MemoryStore cleanup is working

### Debug Mode

```typescript
// Add logging to debug rate limiting
const debugLimit = rateLimiter({
  // ... other options
  onLimitReached: (c, info) => {
    console.log(`Rate limit exceeded: ${getClientIP(c)}, hits: ${info.hits}`);
  }
});
```

### Testing Specific IPs

```bash
# Test with specific IP
curl -X POST http://localhost:3000/chat/ \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 203.0.113.1" \
  -d '{"message": "test"}'
```

## Migration Notes

This implementation replaces a custom rate limiting solution with the official `hono-rate-limiter` package, providing:

- Better performance and reliability
- Standard HTTP headers
- More configuration options  
- Active maintenance and updates
- Better TypeScript support

The API remains the same for importing and using the rate limiters in routes.