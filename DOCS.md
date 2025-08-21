# AI Customer Support - Complete Documentation

A comprehensive AI-powered customer support system with telegram bot integration, admin dashboard, and intelligent conversation management.

## 🎯 Project Overview

An AI-powered customer support system featuring:
- **AI Chat Interface**: Real-time conversations with intelligent responses
- **Admin Dashboard**: Management interface with conversation monitoring
- **Mood/Interest Analysis**: Customer sentiment evaluation and admin alerts
- **Conversation Handover**: Seamless transition from AI to human support
- **Product Management**: Full CRUD operations for products
- **Rate Limiting**: Comprehensive protection against abuse

### Core Features
- FAQ answering and service marketing
- Customer mood and interest evaluation
- Admin conversation takeover with AI assistance
- Critical conversation escalation alerts
- Response suggestions based on customer analysis
- Product catalog management
- Advanced rate limiting and security

## 🎨 Design System

### Philosophy
**Minimalist black and white aesthetic** with:
- Sharp, clean lines and high contrast (21:1 ratio)
- No shadows, gradients, or decorative colors
- Consistent spacing and typography
- Professional, accessible interface

### Color Palette
```css
Primary:   #000000 (black) - text, borders, buttons
Background: #ffffff (white) - all backgrounds
Hover:     #f9fafb (gray-50) - subtle hover states
Error:     #b91c1c (red-700) - critical alerts only
```

### Typography Scale
- **Page Titles**: `text-lg font-bold`
- **Body Text**: `text-sm font-normal`
- **Small Text**: `text-xs font-medium`

## 🏗️ Architecture

### Tech Stack
- **Backend**: Hono.js with Node.js
- **Frontend**: Hono JSX (React-like)
- **Database**: SQLite with Drizzle ORM
- **AI**: OpenAI/DeepSeek integration
- **Styling**: Tailwind CSS
- **Rate Limiting**: hono-rate-limiter with memory store

### Key Components

#### Chat System
- **Real-time messaging** with auto-scroll and typing indicators
- **API endpoints**: GET `/chat/:id` and POST `/chat`
- **Custom hooks**: `useApi` and `useChatMessages` for state management
- **Modular components**: Separate header, messages, and input components

#### Admin System
- **Secure authentication** with session management (HTTP-only cookies, 1-hour expiration)
- **Default credentials**: admin/admin123 (configurable via ADMIN_USERNAME/ADMIN_PASSWORD env vars)
- **Dashboard interface** with stats and action cards
- **Conversation monitoring** and handover capabilities
- **Protected routes** with `requireAdminAuth` middleware
- **Routes**: `/admin/login`, `/admin/dashboard`, `/admin/logout`, `/admin/conversations`, `/admin/products`

#### Card Components
- **StatsCard**: Metrics display with icon, title, and value
  ```tsx
  <StatsCard title="Total Users" value="1,247" icon="👥" />
  ```
- **ActionCard**: Interactive navigation and action buttons (supports onClick or href)
  ```tsx
  <ActionCard title="Export Data" icon="📤" onClick={handleExport} />
  ```
- **ContentCard**: Flexible container with optional headers
  ```tsx
  <ContentCard title="Section Title">{children}</ContentCard>
  ```
- **EmptyState**: No-data scenarios with helpful messaging and optional actions
  ```tsx
  <EmptyState icon="📋" title="No data" action={{text: "Reload", href: "/reload"}} />
  ```

## 📋 Admin API Documentation

### Authentication

All admin API endpoints require authentication. Login first:

```
POST /admin/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin123
```

### Base URL
All admin API endpoints are prefixed with `/admin/api`

### Conversation Management Endpoints

#### 1. Get Conversations List
```
GET /admin/api/conversations
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv_123",
      "customerName": "John Doe",
      "channel": "web",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:45:00Z",
      "messageCount": 5,
      "lastMessage": "Thank you for your help!",
      "lastMessageAt": "2024-01-15T11:45:00Z"
    }
  ]
}
```

#### 2. Get Conversation Details
```
GET /admin/api/conversations/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "conv_123",
    "customerName": "John Doe",
    "channel": "web",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z",
    "messages": [
      {
        "id": "msg_1",
        "message": "Hello, I need help with my order",
        "role": "user",
        "userId": null,
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "msg_2",
        "message": "I'd be happy to help you with your account. What specific issue are you experiencing?",
        "role": "assistant",
        "userId": null,
        "createdAt": "2024-01-15T10:31:00Z"
      }
    ],
    "summary": "Customer needed help with account access issues."
  }
}
```

#### 3. Get Conversation Statistics
```
GET /admin/api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalConversations": 1250,
    "totalMessages": 8750,
    "averageMessagesPerConversation": 7.0
  }
}
```

#### 4. Kill Conversation
```
POST /admin/api/conversations/:id/kill
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation killed successfully"
}
```

#### 5. Reactivate Conversation
```
POST /admin/api/conversations/:id/reactivate
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation reactivated successfully"
}
```

### Product Management Endpoints

#### 1. Get All Products
```
GET /admin/api/products
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_123",
      "name": "Premium Support Package",
      "price": 99.99,
      "description": "24/7 premium customer support",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:45:00Z"
    }
  ]
}
```

#### 2. Create Product
```
POST /admin/api/products
Content-Type: application/json

{
  "name": "New Product",
  "price": 149.99,
  "description": "Product description"
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `price`: Required, positive number (>= 0)
- `description`: Required, non-empty string

#### 3. Update Product
```
PUT /admin/api/products/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 199.99,
  "description": "Updated product description"
}
```

#### 4. Delete Product
```
DELETE /admin/api/products/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Error Responses

**Not Found (404):**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## 🔒 Rate Limiting Implementation

### Overview
Rate limiting is implemented using `hono-rate-limiter` with memory store to prevent abuse and protect AI API costs.

### Rate Limit Tiers

| Endpoint | Method | Rate Limit | Purpose |
|----------|--------|------------|---------|
| `POST /chat/` | POST | 3 requests/5min | AI chat generation |
| `POST /chat/new` | POST | 5 requests/min | New conversations |
| `GET /chat/*` | GET | 100 requests/15min | Data retrieval |
| Global `*` | ALL | 100 requests/15min | All requests |

### Configuration
```typescript
// Strict rate limit for AI operations
export const strictRateLimit = rateLimiter({
  windowMs: 5 * 60 * 1000,  // 5 minutes
  limit: 3,                 // 3 requests per 5 minutes
  message: "This operation is rate limited. Please try again later.",
  standardHeaders: "draft-6",
  keyGenerator: (c) => getClientIP(c),
});
```

### Headers
The middleware sets standard rate limiting headers:
- `RateLimit-Limit`: Maximum requests allowed in window
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Unix timestamp when window resets
- `Retry-After`: Seconds to wait before retry (429 only)

### Frontend Integration
```javascript
async function sendChatMessage(message) {
  try {
    const response = await fetch('/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    // Check rate limit headers
    const remaining = response.headers.get('RateLimit-Remaining');
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      showRateLimitMessage(`Please wait ${retryAfter} seconds`);
      return;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat error:', error);
  }
}
```

## 👥 Admin Conversations View

### Overview
The admin conversations view provides comprehensive interface for managing customer conversations.

### Features

#### Conversation List Sidebar
- Total conversation count in header
- Refresh button for manual updates
- Individual conversation cards showing:
  - Customer name (or "Anonymous")
  - Communication channel
  - Last message preview
  - Message count and timestamps
  - Status indicator ("KILLED" badge)

#### Conversation Details Main Area
- Conversation header with customer info and status
- Action buttons (Kill/Reactivate conversation)
- Complete message history with timestamps
- Status notifications for killed conversations

#### Interactive Features
- Real-time conversation selection
- Visual feedback for selected conversations
- Confirmation dialogs for destructive actions
- Loading states and error handling
- Responsive design

### Navigation
- **Access**: `/admin/conversations` (authentication required)
- **Dashboard Link**: "View Conversations" in Quick Actions
- **Back Navigation**: "← Back to Dashboard" link

### Conversation Management

#### Kill Conversation
- **Purpose**: Prevents users from sending new messages
- **Effect**: Users receive 403 error when attempting to send messages
- **Visual**: Shows "KILLED" status badge

#### Reactivate Conversation
- **Purpose**: Allows users to resume messaging
- **Process**: Single click to reactivate
- **Visual**: Status changes back to "ACTIVE"

## 🛍️ Product Management System

### Overview
Complete CRUD interface for managing products in the admin panel.

### Features Implemented

#### Backend Services
- **AdminService Extensions**: Added product management methods
- **Database Integration**: Uses existing `product` table
- **API Endpoints**: Complete REST API for product operations
- **Authentication**: All endpoints require admin login

#### Frontend Interface
- **Product Management Page**: Full-featured interface at `/admin/products`
- **Modal Forms**: Create and edit products using dialogs
- **Confirmation Dialogs**: Safe deletion with confirmation
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Automatic refresh after operations

#### Security Features
- **Admin Authentication**: All operations require admin login
- **Input Validation**: Server-side validation for all fields
- **Error Handling**: Comprehensive error messages
- **XSS Protection**: Proper input sanitization

### Database Schema
```sql
CREATE TABLE product (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

### Usage Instructions

#### For Administrators
1. **Access**: Navigate to `/admin/products` after login
2. **Add Product**: Click "Add New Product" → Fill form → Click "Create"
3. **Edit Product**: Click "Edit" → Modify fields → Click "Update"
4. **Delete Product**: Click "Delete" → Confirm in dialog

#### Validation Rules
- **Name**: Required, non-empty string, trimmed
- **Price**: Required, positive number (>= 0)
- **Description**: Required, non-empty string, trimmed

## 🔧 Standard Patterns

### Page Layout Template
```html
<div class="flex flex-col h-screen bg-white">
  <header class="text-black px-4 py-2 border-b border-black">
    <h1 class="text-lg font-bold text-center">Page Title</h1>
  </header>
  <main class="flex-1 overflow-y-auto">
    <!-- Content -->
  </main>
</div>
```

### Button Patterns
```html
<!-- Primary Action -->
<button class="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black">

<!-- Secondary Action -->
<button class="bg-white text-black px-4 py-2 border border-black hover:bg-gray-50 transition-colors font-medium">
```

### Form Elements
```html
<!-- Input -->
<input class="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400">

<!-- Label -->
<label class="block text-sm font-medium text-black mb-2">

<!-- Form Group -->
<div class="space-y-2">
  <label class="block text-sm font-medium text-black">Username</label>
  <input class="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400">
</div>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Default (0px+)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

### Grid Patterns
```html
<!-- Dashboard Stats -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">

<!-- Action Buttons -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
```

## 🚨 Error Handling

### Standard Errors
```html
<div class="border border-black bg-white px-4 py-3 text-sm text-black">
  <strong>Error:</strong> Message here
</div>
```

### Critical Errors
```html
<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
  Critical error message
</div>
```

### Rate Limit Errors
```json
{
  "message": "Too many requests, please try again later."
}
```

## ✅ Development Guidelines

### Implementation Checklist
- [ ] **Colors**: Only black, white, gray (red for errors only)
- [ ] **Borders**: Sharp edges with `border-black`
- [ ] **Typography**: Follows hierarchy (lg/bold headers, sm body)
- [ ] **Spacing**: Consistent padding/margin scale (`p-4`, `p-6`, `gap-4`, `gap-6`)
- [ ] **Interactions**: Hover states with `transition-colors`
- [ ] **Layout**: Follows standard page structure
- [ ] **Accessibility**: High contrast (21:1 ratio), semantic HTML, keyboard navigation
- [ ] **Responsive**: Mobile-first approach with proper touch targets (44px minimum)
- [ ] **Loading States**: Disabled buttons with `opacity-50` and loading text
- [ ] **Rate Limiting**: Check and handle 429 responses appropriately

### Anti-Patterns (Never Use)
- Rounded corners (except `rounded-2xl` for chat bubbles)
- Box shadows or gradients
- Colors other than grayscale
- Complex animations
- Decorative elements

### File Structure
```
src/
├── frontend/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page-level components
│   └── hooks/         # Custom React hooks
├── routes/            # API route handlers
├── middleware/        # Authentication & validation & rate limiting
├── services/          # Business logic & AI integration
└── db/               # Database schema & queries
```

## 🔐 Security Considerations

### Current Implementation
- Simple username/password authentication with in-memory session storage
- HTTP-only cookies with secure flags (SameSite=Strict, HttpOnly)
- 1-hour session expiration
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection protection via Drizzle ORM

### Production Recommendations
- [ ] **Password Hashing**: Use bcrypt for password storage
- [ ] **Session Storage**: Replace in-memory with Redis/database
- [ ] **HTTPS Only**: Set `secure: true` on cookies
- [ ] **CSRF Protection**: Add CSRF tokens to forms
- [ ] **Audit Logging**: Log admin actions and login attempts
- [ ] **Redis Store**: Replace memory store for multi-instance deployments

## 🧪 Testing

### Manual Testing
1. **Rate Limiting**: Use included test scripts and `scratch.http`
2. **Admin Functions**: Test conversation and product management
3. **API Endpoints**: Verify all CRUD operations work correctly
4. **Authentication**: Test login/logout flow
5. **Error Handling**: Verify proper error messages and states

### Test Scripts
```bash
# Rate limit tests
npm run test:rate-limit
npm run test:rate-limit:all
npm run test:rate-limit:performance

# API testing with curl
curl -X GET http://localhost:3000/admin/api/conversations -b cookies.txt
```

## 🚀 Getting Started

### Development Setup
```bash
cd ai-customer-support
yarn install
yarn build:fe  # Build frontend
yarn start     # Start server
```

### Access Points
- **Main Chat**: `http://localhost:3000/`
- **Admin Login**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Conversations**: `http://localhost:3000/admin/conversations`
- **Products**: `http://localhost:3000/admin/products`

### Default Credentials
- **Username**: admin
- **Password**: admin123

## 🎯 Future Enhancements

### Planned Features
- [ ] Advanced mood classification (classify conversation tone)
- [ ] Conversation summarization (keep token size in check)
- [ ] Real-time admin notifications for critical conversations
- [ ] Role-based access control
- [ ] Redis-based rate limiting for production scaling
- [ ] Product image uploads and categorization
- [ ] Advanced conversation analytics and reporting

### AI Components to Build
- **Classifier**: Tone evaluation based on conversation flow
- **Summarizer**: Conversation summarization for token management
- **Response Suggester**: Generate context-aware reply suggestions
- **Mood Evaluator**: Customer sentiment analysis for admin insights

## 📊 Performance Considerations

### Current Optimizations
- Memory-based rate limiting with automatic cleanup
- Efficient database queries with Drizzle ORM
- Minimal frontend JavaScript bundle
- Responsive design with mobile-first approach

### Production Scaling
- Consider Redis for rate limiting in multi-instance deployments
- Implement caching for frequently accessed data
- Add database indexing for large datasets
- Monitor rate limiting effectiveness and adjust limits

## 🐛 Troubleshooting

### Common Issues

#### Server Won't Start
- Ensure port 3000 is available
- Check for TypeScript compilation errors
- Run `yarn typecheck` to verify code

#### Rate Limits Too Strict
- Adjust limits in `src/middleware/rateLimit.ts`
- Consider different tiers for different user types
- Monitor rate limit metrics

#### Authentication Issues
- Verify admin credentials (admin/admin123)
- Clear browser cookies and re-login
- Check session hasn't expired (1 hour limit)

#### Database Errors
- Ensure SQLite database file exists and has proper permissions
- Run `yarn db:push` to apply schema changes
- Check database file permissions

### Debug Mode
```bash
DEBUG=true yarn start
```

---

**Development Workflow**: Check existing components first → Follow standard patterns → Maintain theme consistency → Handle rate limits appropriately → Document new patterns when created

This documentation serves as the complete reference for the AI Customer Support system, covering all implemented features, patterns, and best practices for development and deployment.