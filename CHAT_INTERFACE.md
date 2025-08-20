# Chat Interface Documentation

## Overview

This chat interface provides a real-time messaging system for customer support interactions. It's built using Hono.js with a React-like frontend using Hono JSX. The interface features a modular component architecture with custom React hooks for API management.

## Features

- **Full-Width Layout**: Chat interface occupies the complete available screen width
- **Real-time Chat**: Send and receive messages in a conversation
- **Message History**: View all previous messages in a conversation
- **Auto-scroll**: Automatically scrolls to the latest message
- **Typing Indicators**: Shows when the assistant is responding
- **Error Handling**: Displays network and API errors with user-friendly messages
- **Modular Components**: Clean separation of concerns with reusable components
- **Custom Hooks**: React hooks for API state management
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

## Architecture

### Component Structure

The chat interface is built with modular components for better maintainability and reusability:

#### Main Components

**OngoingChatView** (`/src/frontend/pages/ongoing-chat/ongoing.tsx`)
- Main container component that orchestrates the chat interface
- Uses custom hooks for API management
- Handles URL-based conversation ID extraction
- Coordinates between child components

**ChatHeader** (`/src/frontend/components/chat/ChatHeader.tsx`)
- Displays conversation information
- Shows refresh button and error messages
- Handles error dismissal

**MessagesList** (`/src/frontend/components/chat/MessagesList.tsx`)
- Renders the conversation history
- Handles auto-scrolling to new messages
- Shows loading states and empty states
- Includes typing indicators

**MessageInput** (`/src/frontend/components/chat/MessageInput.tsx`)
- Handles message input and sending
- Auto-expanding textarea
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Send button with loading state

**Individual Message Components:**
- `ChatMessage`: Individual message bubble
- `TypingIndicator`: Shows when assistant is responding
- `LoadingIndicator`: Generic loading spinner
- `EmptyState`: Shown when no messages exist

### Custom Hooks

**useApi** (`/src/frontend/hooks/useApi.tsx`)
- Generic hook for API calls with loading, error, and data states
- Provides `execute`, `reset`, and `setError` methods
- Handles network errors and HTTP status codes

**useChatMessages** (specialized hook)
- Built on top of `useApi` for chat-specific operations
- Provides `fetchMessages` and `sendMessage` functions
- Manages chat messages array and loading states

### State Management

The application uses React hooks for state management:
- `useChatMessages`: Handles messages, loading states, and API calls
- Local component state for UI-specific state (typing indicators, form inputs)
- URL parameters for conversation ID

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

### Technical Details

#### Data Flow
1. `OngoingChatView` mounts and extracts conversation ID from URL
2. `useChatMessages` hook is initialized
3. `fetchMessages()` is called automatically when conversation ID is available
4. `MessagesList` component renders messages with auto-scroll
5. User types in `MessageInput` and submits
6. `handleSendMessage` calls the custom hook's `sendMessage` function
7. Messages are refreshed to include AI response
8. Components re-render with updated state

#### Performance Optimizations
- **Component Separation**: Smaller components reduce re-render scope
- **Custom Hooks**: Centralized API logic prevents duplication
- **Auto-scroll Optimization**: Uses `setTimeout` and `useRef` for smooth scrolling
- **Loading States**: Prevent duplicate API calls and provide user feedback
- **Full-Width Layout**: Maximizes screen real estate usage

#### File Structure
```
src/frontend/
├── hooks/
│   └── useApi.tsx           # Custom API hooks
├── components/
│   ├── chat-layout.tsx      # Main layout wrapper
│   └── chat/                # Chat-specific components
│       ├── index.tsx        # Component exports
│       ├── ChatHeader.tsx   # Header with conversation info
│       ├── ChatMessage.tsx  # Individual message component
│       ├── MessagesList.tsx # Messages container with scroll
│       ├── MessageInput.tsx # Input form with auto-expand
│       ├── TypingIndicator.tsx  # Typing animation
│       ├── LoadingIndicator.tsx # Loading spinner
│       └── EmptyState.tsx   # Empty state message
└── pages/
    └── ongoing-chat/
        └── ongoing.tsx      # Main chat page component
```

#### Browser Compatibility
- Modern browsers with ES6+ support
- Requires fetch API and React hooks support
- Uses CSS Grid and Flexbox for responsive layout
- Full-width design adapts to all screen sizes