# Admin API Documentation

This document describes the REST API endpoints available for administrators to manage conversations in the AI Customer Support system.

## Authentication

All admin API endpoints require authentication. You must first log in as an admin to access these endpoints.

### Login
```
POST /admin/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin123
```

The login sets an HTTP-only session cookie that must be present for all subsequent API calls.

## Base URL

All admin API endpoints are prefixed with `/admin/api`

## Endpoints

### 1. Get Conversations List

Retrieve a list of all conversations with metadata.

**Endpoint:** `GET /admin/api/conversations`

**Example Request:**
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

### 2. Get Conversation Details

Retrieve detailed information about a specific conversation including all messages.

**Endpoint:** `GET /admin/api/conversations/:id`

**Parameters:**
- `id` (string): The conversation ID

**Example Request:**
```
GET /admin/api/conversations/conv_123
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
        "message": "Hello, I need help with my account",
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
    "summary": "Customer needed help with account access issues. Resolved by providing password reset instructions."
  }
}
```

### 3. Get Conversation Statistics

Retrieve basic statistics about conversations.

**Endpoint:** `GET /admin/api/stats`

**Example Request:**
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

### 4. Update Conversation

Update conversation metadata (customer name and/or channel).

**Endpoint:** `PUT /admin/api/conversations/:id`

**Parameters:**
- `id` (string): The conversation ID

**Request Body:**
```json
{
  "customerName": "Updated Customer Name",
  "channel": "updated_channel"
}
```

**Example Request:**
```
PUT /admin/api/conversations/conv_123
Content-Type: application/json

{
  "customerName": "John Doe Updated",
  "channel": "email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation updated successfully"
}
```

### 5. Kill Conversation

Mark a conversation as killed, preventing users from sending new messages.

**Endpoint:** `POST /admin/api/conversations/:id/kill`

**Parameters:**
- `id` (string): The conversation ID

**Example Request:**
```
POST /admin/api/conversations/conv_123/kill
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation killed successfully"
}
```

### 6. Reactivate Conversation

Reactivate a killed conversation, allowing users to send messages again.

**Endpoint:** `POST /admin/api/conversations/:id/reactivate`

**Parameters:**
- `id` (string): The conversation ID

**Example Request:**
```
POST /admin/api/conversations/conv_123/reactivate
```

**Response:**
```json
{
  "success": true,
  "message": "Conversation reactivated successfully"
}
```



## Error Responses

All endpoints return consistent error responses in case of failures:

### Not Found (404)
```json
{
  "success": false,
  "error": "Conversation not found"
}
```

### Authentication Required (302)
If not authenticated, requests will redirect to `/admin/login`.

### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to fetch conversations"
}
```

## Usage Examples

### JavaScript/Fetch Example
```javascript
// Get all conversations
async function getConversations() {
  const response = await fetch('/admin/api/conversations', {
    credentials: 'include' // Include cookies for authentication
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  
  return await response.json();
}

// Get specific conversation
async function getConversation(id) {
  const response = await fetch(`/admin/api/conversations/${id}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  
  return await response.json();
}

// Kill conversation
async function killConversation(id) {
  const response = await fetch(`/admin/api/conversations/${id}/kill`, {
    method: 'POST',
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to kill conversation');
  }
  
  return await response.json();
}

// Reactivate conversation
async function reactivateConversation(id) {
  const response = await fetch(`/admin/api/conversations/${id}/reactivate`, {
    method: 'POST',
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to reactivate conversation');
  }
  
  return await response.json();
}


```

### cURL Examples
```bash
# Get conversations
curl -X GET "http://localhost:3000/admin/api/conversations" \
  -b cookies.txt

# Get conversation details
curl -X GET "http://localhost:3000/admin/api/conversations/conv_123" \
  -b cookies.txt

# Update conversation
curl -X PUT "http://localhost:3000/admin/api/conversations/conv_123" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"customerName": "Updated Name", "channel": "email"}'

# Kill conversation
curl -X POST "http://localhost:3000/admin/api/conversations/conv_123/kill" \
  -b cookies.txt

# Reactivate conversation
curl -X POST "http://localhost:3000/admin/api/conversations/conv_123/reactivate" \
  -b cookies.txt


```

## Product Management Endpoints

### 7. Get All Products

Retrieve a list of all products.

**Endpoint:** `GET /admin/api/products`

**Example Request:**
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
      "description": "24/7 premium customer support with dedicated account manager",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:45:00Z"
    }
  ]
}
```

### 8. Get Single Product

Retrieve detailed information about a specific product.

**Endpoint:** `GET /admin/api/products/:id`

**Parameters:**
- `id` (string): The product ID

**Example Request:**
```
GET /admin/api/products/prod_123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Premium Support Package",
    "price": 99.99,
    "description": "24/7 premium customer support with dedicated account manager",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:45:00Z"
  }
}
```

### 9. Create Product

Create a new product.

**Endpoint:** `POST /admin/api/products`

**Request Body:**
```json
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

**Example Request:**
```
POST /admin/api/products
Content-Type: application/json

{
  "name": "Basic Support Package",
  "price": 49.99,
  "description": "Standard customer support during business hours"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_456",
    "name": "Basic Support Package",
    "price": 49.99,
    "description": "Standard customer support during business hours",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  },
  "message": "Product created successfully"
}
```

### 10. Update Product

Update an existing product.

**Endpoint:** `PUT /admin/api/products/:id`

**Parameters:**
- `id` (string): The product ID

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 199.99,
  "description": "Updated product description"
}
```

**Example Request:**
```
PUT /admin/api/products/prod_123
Content-Type: application/json

{
  "name": "Premium Support Package Plus",
  "price": 129.99,
  "description": "24/7 premium support with priority response and dedicated manager"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Premium Support Package Plus",
    "price": 129.99,
    "description": "24/7 premium support with priority response and dedicated manager",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T13:00:00Z"
  },
  "message": "Product updated successfully"
}
```

### 11. Delete Product

Delete an existing product.

**Endpoint:** `DELETE /admin/api/products/:id`

**Parameters:**
- `id` (string): The product ID

**Example Request:**
```
DELETE /admin/api/products/prod_123
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Security Considerations

1. All endpoints require admin authentication
2. Session cookies are HTTP-only and SameSite=Strict
3. SQL injection protection through Drizzle ORM
4. Input validation for conversation updates and product management
5. Product input sanitization and validation

## Data Format

The conversations list endpoint returns all conversations in a simple array format, ordered by most recently updated first.

## Conversation Status

Conversations can have one of two statuses:
- `active`: Normal state, users can send messages
- `killed`: Conversation is closed, users cannot send new messages

When a conversation is killed:
- The user will receive a 403 error when trying to send messages
- The conversation appears with a "KILLED" status in the admin interface
- Admins can still view all messages and reactivate if needed

## User Message Blocking

When users attempt to send messages to a killed conversation, they will receive:

```json
{
  "error": "This conversation has been closed and cannot accept new messages"
}
```

With HTTP status code 403 (Forbidden).