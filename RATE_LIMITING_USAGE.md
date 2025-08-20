# Rate Limiting Usage Examples

This document provides practical examples of how rate limiting is implemented and can be used in the AI Customer Support application.

## Current Implementation

### Applied Rate Limits

The following rate limits are currently active in the application:

```typescript
// Main chat route - AI generation (most restrictive)
router.post("/", strictRateLimit, validateReqBody(chatSchema, async (c, data) => {
  // AI chat generation logic
}));

// New conversation creation
router.post("/chat/new", conversationRateLimit, async (c) => {
  // New conversation logic
});

// API endpoints
router.get("/", apiRateLimit, async (c) => {
  // Get conversations
});

// Global rate limiting
app.use("*", apiRateLimit);
```

### Rate Limit Configuration

```typescript
// From src/middleware/rateLimit.ts
export const strictRateLimit = rateLimiter({
  windowMs: 5 * 60 * 1000,  // 5 minutes
  limit: 3,                 // 3 requests per 5 minutes
  message: "This operation is rate limited. Please try again later.",
  standardHeaders: "draft-6",
  keyGenerator: (c) => getClientIP(c),
});

export const conversationRateLimit = rateLimiter({
  windowMs: 60 * 1000,      // 1 minute
  limit: 5,                 // 5 requests per minute
  message: "Too many new conversations. Please wait before starting another conversation.",
  standardHeaders: "draft-6",
  keyGenerator: (c) => getClientIP(c),
});
```

## Testing the Rate Limits

### 1. Test AI Chat Endpoint (Strict Rate Limit)

```bash
# Test the main chat endpoint
curl -X POST http://localhost:3000/chat/ \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 192.168.1.100" \
  -d '{"message": "Hello, I need help with my order"}'

# After 3 requests in 5 minutes, you'll get:
# HTTP 429 - "This operation is rate limited. Please try again later."
```

### 2. Test New Conversation Creation

```bash
# Test new conversation endpoint
curl -X POST http://localhost:3000/chat/new \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-Forwarded-For: 192.168.1.101" \
  -d "message=I want to start a new conversation"

# After 5 requests in 1 minute, you'll get rate limited
```

### 3. Check Rate Limit Headers

```bash
# Check rate limit status
curl -I -X GET http://localhost:3000/chat/12345 \
  -H "X-Forwarded-For: 192.168.1.102"

# Response headers include:
# RateLimit-Limit: 100
# RateLimit-Remaining: 95
# RateLimit-Reset: 1640995200
```

## Frontend Integration Examples

### 1. JavaScript Fetch with Rate Limit Handling

```javascript
async function sendChatMessage(message, conversationId = null) {
  const url = '/chat/';
  const payload = {
    message: message,
    conversation_id: conversationId
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Extract rate limit information
    const rateLimitInfo = {
      limit: response.headers.get('RateLimit-Limit'),
      remaining: response.headers.get('RateLimit-Remaining'),
      reset: response.headers.get('RateLimit-Reset'),
    };

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const errorMessage = await response.text();
      
      showRateLimitWarning(errorMessage, retryAfter);
      return { 
        success: false, 
        rateLimited: true, 
        retryAfter: parseInt(retryAfter),
        rateLimitInfo 
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { 
      success: true, 
      data, 
      rateLimitInfo 
    };

  } catch (error) {
    console.error('Chat request failed:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Usage example
async function handleChatSubmit() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();
  
  if (!message) return;

  const result = await sendChatMessage(message);
  
  if (result.rateLimited) {
    // Show user-friendly rate limit message
    showMessage(`Please wait ${result.retryAfter} seconds before sending another message.`, 'warning');
    
    // Disable input temporarily
    disableChatInput(result.retryAfter * 1000);
  } else if (result.success) {
    // Handle successful response
    displayChatMessage(result.data);
    messageInput.value = '';
    
    // Update rate limit UI
    updateRateLimitIndicator(result.rateLimitInfo);
  } else {
    showMessage('Failed to send message. Please try again.', 'error');
  }
}
```

### 2. Rate Limit UI Indicator

```javascript
function updateRateLimitIndicator(rateLimitInfo) {
  const indicator = document.getElementById('rate-limit-indicator');
  if (!indicator) return;

  const { limit, remaining, reset } = rateLimitInfo;
  const percentage = (remaining / limit) * 100;
  
  if (remaining === 0) {
    indicator.className = 'rate-limit-exceeded';
    indicator.textContent = 'Rate limit exceeded';
  } else if (percentage < 25) {
    indicator.className = 'rate-limit-warning';
    indicator.textContent = `${remaining}/${limit} requests remaining`;
  } else {
    indicator.className = 'rate-limit-normal';
    indicator.textContent = `${remaining}/${limit}`;
  }
}

function disableChatInput(duration) {
  const input = document.getElementById('message-input');
  const button = document.getElementById('send-button');
  
  input.disabled = true;
  button.disabled = true;
  
  // Re-enable after duration
  setTimeout(() => {
    input.disabled = false;
    button.disabled = false;
  }, duration);
}
```

### 3. React Hook for Rate Limiting

```jsx
import { useState, useCallback } from 'react';

function useRateLimit() {
  const [rateLimitInfo, setRateLimitInfo] = useState({
    limit: null,
    remaining: null,
    reset: null,
    isRateLimited: false,
    retryAfter: null
  });

  const makeRequest = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      
      // Extract rate limit headers
      const newRateLimitInfo = {
        limit: parseInt(response.headers.get('RateLimit-Limit')) || null,
        remaining: parseInt(response.headers.get('RateLimit-Remaining')) || null,
        reset: parseInt(response.headers.get('RateLimit-Reset')) || null,
        isRateLimited: response.status === 429,
        retryAfter: parseInt(response.headers.get('Retry-After')) || null
      };
      
      setRateLimitInfo(newRateLimitInfo);
      
      return {
        response,
        rateLimitInfo: newRateLimitInfo
      };
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }, []);

  return { rateLimitInfo, makeRequest };
}

// Usage in component
function ChatComponent() {
  const { rateLimitInfo, makeRequest } = useRateLimit();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (rateLimitInfo.isRateLimited) {
      alert(`Please wait ${rateLimitInfo.retryAfter} seconds`);
      return;
    }

    setIsLoading(true);
    try {
      const { response } = await makeRequest('/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        const data = await response.json();
        // Handle success
      }
    } catch (error) {
      console.error('Send message failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading || rateLimitInfo.isRateLimited}
      />
      <button 
        onClick={sendMessage}
        disabled={isLoading || rateLimitInfo.isRateLimited}
      >
        Send
      </button>
      
      {rateLimitInfo.remaining !== null && (
        <div className={`rate-limit ${rateLimitInfo.remaining < 2 ? 'warning' : ''}`}>
          Requests remaining: {rateLimitInfo.remaining}/{rateLimitInfo.limit}
        </div>
      )}
    </div>
  );
}
```

## Custom Rate Limiting Examples

### 1. User-Based Rate Limiting

```typescript
// Custom rate limiter for authenticated users
import { createRateLimit } from '../middleware/rateLimit';

const userRateLimit = createRateLimit({
  windowMs: 60 * 1000,  // 1 minute
  limit: 20,            // 20 requests per minute per user
  keyGenerator: (c) => {
    // Use user ID if available, fall back to IP
    const userId = c.get('userId');
    return userId || getClientIP(c);
  },
  message: 'User rate limit exceeded. Please slow down.'
});

// Apply to protected routes
router.post('/api/user/action', userRateLimit, async (c) => {
  // User action logic
});
```

### 2. API Key Based Rate Limiting

```typescript
const apiKeyRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  limit: 1000,               // 1000 requests per hour per API key
  keyGenerator: (c) => {
    const apiKey = c.req.header('X-API-Key');
    return apiKey || getClientIP(c);
  },
  message: 'API key rate limit exceeded.'
});
```

### 3. Dynamic Rate Limiting

```typescript
import { rateLimiter } from 'hono-rate-limiter';

const dynamicRateLimit = rateLimiter({
  windowMs: 60 * 1000,
  limit: (c) => {
    // Different limits based on user tier
    const userTier = c.get('userTier');
    if (userTier === 'premium') return 100;
    if (userTier === 'basic') return 50;
    return 10; // free tier
  },
  keyGenerator: (c) => c.get('userId') || getClientIP(c),
  message: 'Rate limit exceeded for your tier.'
});
```

## Monitoring and Logging

### 1. Log Rate Limit Events

```typescript
// Add to your main app file
app.onError((err, c) => {
  if (c.res.status === 429) {
    console.log(`Rate limit exceeded: ${getClientIP(c)} at ${new Date().toISOString()}`);
    
    // Optional: Send to monitoring service
    // sendToMonitoring('rate_limit_exceeded', { ip: getClientIP(c), path: c.req.path });
  }
  
  return c.text('Server Error', 500);
});
```

### 2. Rate Limit Metrics

```typescript
// Track rate limiting metrics
let rateLimitMetrics = {
  totalHits: 0,
  rateLimitedRequests: 0,
  uniqueIPs: new Set()
};

app.use('*', async (c, next) => {
  rateLimitMetrics.totalHits++;
  rateLimitMetrics.uniqueIPs.add(getClientIP(c));
  
  await next();
  
  if (c.res.status === 429) {
    rateLimitMetrics.rateLimitedRequests++;
  }
});

// Endpoint to view metrics (admin only)
app.get('/admin/metrics', async (c) => {
  return c.json({
    ...rateLimitMetrics,
    uniqueIPs: rateLimitMetrics.uniqueIPs.size
  });
});
```

## Production Considerations

### 1. Environment-Based Configuration

```typescript
// Different limits for different environments
const getChatRateLimit = () => {
  const env = process.env.NODE_ENV;
  
  if (env === 'development') {
    return { windowMs: 60 * 1000, limit: 100 }; // More lenient for dev
  }
  
  if (env === 'production') {
    return { windowMs: 5 * 60 * 1000, limit: 3 }; // Strict for production
  }
  
  return { windowMs: 2 * 60 * 1000, limit: 10 }; // Default
};
```

### 2. Graceful Degradation

```typescript
// Fallback when rate limiting fails
const safeRateLimit = rateLimiter({
  // ... config
  onLimitReached: (c, info) => {
    console.warn(`Rate limit reached for ${getClientIP(c)}`);
  },
  skip: (c) => {
    // Skip rate limiting for health checks
    return c.req.path === '/health';
  }
});
```

This completes the practical usage examples for the rate limiting implementation using `hono-rate-limiter` with memory store.