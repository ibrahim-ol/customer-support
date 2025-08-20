# Admin Conversations View

This document describes the new admin conversations view that allows administrators to view and manage customer conversations in the AI Customer Support system.

## Overview

The admin conversations view provides a comprehensive interface for administrators to:

- View a list of all customer conversations
- Select and view detailed conversation history
- See conversation metadata (customer name, channel, message count, timestamps)
- Navigate through conversations with a sidebar list and main content area

## Accessing the Conversations View

1. Log in to the admin panel at `/admin/login` with your admin credentials
2. From the admin dashboard, click on "View Conversations" in the Quick Actions section
3. Alternatively, navigate directly to `/admin/conversations` (authentication required)

## Features

### Conversation List Sidebar

The left sidebar displays:

- **Total conversation count** in the header
- **Individual conversation cards** showing:
  - Customer name (or "Anonymous" if not set)
  - Communication channel (web, email, etc.)
  - Last message preview
  - Message count
  - Last activity timestamp
- **Loading states** and error handling
- **Click to select** functionality

### Conversation Details Main Area

The main content area shows:

- **Conversation header** with:
  - Customer name
  - Channel information
  - Creation timestamp
  - Total message count
- **Message history** displaying:
  - User messages (right-aligned, blue background)
  - AI assistant messages (left-aligned, white background with border)
  - Timestamps for each message
  - Proper message formatting with line breaks preserved
- **Empty state** when no conversation is selected

### Interactive Features

- **Real-time selection**: Click any conversation in the sidebar to view its details
- **Visual feedback**: Selected conversation is highlighted in the sidebar
- **Responsive design**: Works on different screen sizes
- **Loading states**: Shows loading indicators while fetching data
- **Error handling**: Displays user-friendly error messages

## Technical Implementation

### API Endpoints Used

- `GET /admin/api/conversations` - Fetches the list of all conversations
- `GET /admin/api/conversations/:id` - Fetches detailed conversation with messages

### Data Structure

```typescript
interface ConversationListItem {
  id: string;
  customerName: string;
  channel: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string;
}

interface ConversationDetails extends ConversationListItem {
  messages: Message[];
  summary: string;
}

interface Message {
  id: string;
  message: string;
  role: "user" | "assistant";
  userId: string | null;
  createdAt: string;
}
```

### State Management

The view uses custom React hooks for:

- **useApi**: Generic API call management with loading states and error handling
- **Local state**: Managing selected conversation and UI state

## Navigation

- **Back to Dashboard**: Click the "← Back to Dashboard" link in the header
- **Logout**: Use the "Logout" button in the top-right corner
- **Conversation Selection**: Click any conversation in the sidebar to view details

## Error Handling

The interface handles various error scenarios:

- **Network errors**: Shows connection error messages
- **Authentication errors**: Redirects to login page
- **Not found errors**: Displays conversation not found messages
- **Loading failures**: Provides retry mechanisms

## Performance Considerations

- **Lazy loading**: Conversation details are only loaded when selected
- **Efficient rendering**: Uses React hooks for optimal re-rendering
- **API optimization**: Minimal data transfer with targeted endpoints

## Future Enhancements

Potential improvements for future versions:

- **Search functionality**: Filter conversations by customer name or content
- **Pagination**: Handle large numbers of conversations
- **Real-time updates**: Live conversation updates using WebSockets
- **Export functionality**: Download conversation transcripts
- **Advanced filtering**: Filter by date range, channel, or message count
- **Conversation actions**: Archive, delete, or tag conversations

## Troubleshooting

### Common Issues

1. **Conversations not loading**
   - Check network connection
   - Verify admin authentication
   - Check browser console for error details

2. **Selected conversation not showing**
   - Ensure conversation ID exists in the database
   - Check API endpoint accessibility
   - Verify conversation has messages

3. **Authentication issues**
   - Confirm admin credentials are correct
   - Check session hasn't expired
   - Clear browser cookies and re-login

### Browser Compatibility

The interface is tested and works with:
- Modern Chrome, Firefox, Safari, and Edge browsers
- JavaScript must be enabled
- Cookies must be enabled for authentication

## Security Notes

- All admin API endpoints require authentication
- Session cookies are HTTP-only and secure
- No sensitive data is logged to browser console
- Input validation prevents XSS attacks