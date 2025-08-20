# Chat Interface Documentation

## Overview

This chat interface provides a real-time messaging system for customer support interactions. It's built using Hono.js with a React-like frontend using Hono JSX.

## Features

- **Real-time Chat**: Send and receive messages in a conversation
- **Message History**: View all previous messages in a conversation
- **Auto-scroll**: Automatically scrolls to the latest message
- **Typing Indicators**: Shows when the assistant is responding
- **Error Handling**: Displays network and API errors with user-friendly messages
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-expanding Input**: Text area grows as you type longer messages

## API Endpoints

The chat interface uses the following API endpoints:

### GET `/chat/:conversationId`
Fetches all messages for a specific conversation.

**Response:**
```json
{
  "data": [
    {
      "id": "msg-123",
      "message": "Hello, I need help",
      "role": "user",
      "conversationId": "conv-456",
      "createdAt": "2023-12-01T10:00:00Z"
    },
    {
      "id": "msg-124", 
      "message": "How can I assist you?",
      "role": "assistant",
      "conversationId": "conv-456",
      "createdAt": "2023-12-01T10:01:00Z"
    }
  ]
}
```

### POST `/chat`
Sends a new message to a conversation.

**Request Body:**
```json
{
  "conversation_id": "conv-456",
  "message": "I need help with my order"
}
```

**Response:**
```json
{
  "message": "Sent",
  "data": {
    "id": "msg-125",
    "conversation_id": "conv-456",
    "reply": "I'd be happy to help with your order..."
  }
}
```

## Component Structure

### OngoingChatView
The main chat component located at `/src/frontend/pages/ongoing-chat/ongoing.tsx`

**Key Features:**
- Fetches conversation ID from URL parameters
- Loads message history on mount
- Handles message sending with proper error handling
- Auto-scrolls to new messages
- Shows loading states and typing indicators

**State Management:**
- `messages`: Array of chat messages
- `newMessage`: Current message being typed
- `loading`: Loading state for fetching messages
- `sending`: Loading state for sending messages
- `error`: Error message display
- `conversationId`: Current conversation ID

## Usage

### Starting a Chat
1. Navigate to `/chat/view` to start a new conversation
2. Enter your message and submit the form
3. You'll be redirected to `/chat/view/{conversationId}`

### Continuing a Chat  
1. Navigate directly to `/chat/view/{conversationId}`
2. The interface will load the conversation history
3. Type and send new messages using the input at the bottom

### Keyboard Shortcuts
- **Enter**: Send message
- **Shift + Enter**: Add new line without sending

## Styling

The interface uses Tailwind CSS with a monochrome theme:

- **Primary Color**: Black (#000000)
- **Background**: White (#ffffff)  
- **Text**: Black and gray shades
- **Borders**: Black (#000000)
- **Messages**: User messages are black with white text, assistant messages are white with black text and black borders

## Error Handling

The interface handles several types of errors:

1. **Network Errors**: When the server is unreachable
2. **HTTP Errors**: When the API returns error status codes
3. **Invalid Conversation**: When the conversation ID doesn't exist
4. **Message Send Failures**: When message posting fails

All errors are displayed in a dismissible red banner at the top of the chat.

## Technical Details

### Data Flow
1. Component mounts and extracts conversation ID from URL
2. `fetchMessages()` is called to load conversation history
3. Messages are displayed in chronological order
4. User types message and submits form
5. `sendMessage()` posts to API and refreshes message list
6. Auto-scroll ensures latest message is visible

### Performance Optimizations
- Messages are fetched only once on mount
- Auto-scroll uses `setTimeout` to ensure DOM updates complete
- Text area auto-resizes to prevent layout shifts
- Loading states prevent duplicate API calls

### Browser Compatibility
- Modern browsers with ES6+ support
- Requires fetch API support
- Uses CSS Grid and Flexbox for layout