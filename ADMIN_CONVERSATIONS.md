# Admin Conversations View

This document describes the new admin conversations view that allows administrators to view and manage customer conversations in the AI Customer Support system.

## Overview

The admin conversations view provides a comprehensive interface for administrators to:

- View a list of all customer conversations
- Select and view detailed conversation history
- See conversation metadata (customer name, channel, message count, timestamps)
- Navigate through conversations with a sidebar list and main content area
- Kill conversations to prevent users from sending new messages
- Reactivate killed conversations when needed

## Accessing the Conversations View

1. Log in to the admin panel at `/admin/login` with your admin credentials
2. From the admin dashboard, click on "View Conversations" in the Quick Actions section
3. Alternatively, navigate directly to `/admin/conversations` (authentication required)

## Features

### Conversation List Sidebar

The left sidebar displays:

- **Total conversation count** in the header
- **Refresh button** for manual updates
- **Individual conversation cards** showing:
  - Customer name (or "Anonymous" if not set)
  - Communication channel (web, email, etc.)
  - Last message preview
  - Message count
  - Last activity timestamp
  - Status indicator ("KILLED" badge for killed conversations)
- **Loading states** and error handling
- **Click to select** functionality

### Conversation Details Main Area

The main content area shows:

- **Conversation header** with:
  - Customer name and status badge (ACTIVE/KILLED)
  - Channel information
  - Creation timestamp
  - Total message count
  - Action buttons (Kill/Reactivate conversation)
- **Status notifications** for killed conversations
- **Message history** displaying:
  - User messages (right-aligned, blue background)
  - AI assistant messages (left-aligned, white background with border)
  - Timestamps for each message
  - Proper message formatting with line breaks preserved
- **Empty state** when no conversation is selected

### Interactive Features

- **Real-time selection**: Click any conversation in the sidebar to view its details
- **Visual feedback**: Selected conversation is highlighted in the sidebar
- **Conversation management**: Kill or reactivate conversations with one click
- **Status indicators**: Visual badges show conversation status
- **Confirmation dialogs**: Asks for confirmation before killing conversations
- **Responsive design**: Works on different screen sizes
- **Loading states**: Shows loading indicators while fetching data
- **Error handling**: Displays user-friendly error messages
- **Success notifications**: Shows confirmation when actions complete

## Technical Implementation

### API Endpoints Used

- `GET /admin/api/conversations` - Fetches the list of all conversations
- `GET /admin/api/conversations/:id` - Fetches detailed conversation with messages
- `POST /admin/api/conversations/:id/kill` - Kills a conversation (prevents new messages)
- `POST /admin/api/conversations/:id/reactivate` - Reactivates a killed conversation

### Data Structure

```typescript
interface ConversationListItem {
  id: string;
  customerName: string;
  channel: string;
  status: "active" | "killed";
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

## Conversation Management Features

### Kill Conversation

- **Purpose**: Prevents users from sending new messages to a conversation
- **Process**: Click "Kill Conversation" button → Confirm action → Conversation is marked as killed
- **Effect**: Users receive a 403 error when attempting to send messages
- **Visual**: Conversation shows "KILLED" status badge in both sidebar and header

### Reactivate Conversation

- **Purpose**: Allows users to resume sending messages to a killed conversation
- **Process**: Click "Reactivate" button → Conversation status changes to active
- **Effect**: Users can send messages normally again
- **Visual**: Status badge changes back to "ACTIVE"

## Future Enhancements

Potential improvements for future versions:

- **Search functionality**: Filter conversations by customer name or content
- **Pagination**: Handle large numbers of conversations
- **Real-time updates**: Live conversation updates using WebSockets
- **Export functionality**: Download conversation transcripts
- **Advanced filtering**: Filter by date range, channel, status, or message count
- **Bulk actions**: Kill/reactivate multiple conversations at once
- **Conversation notes**: Add admin notes to conversations
- **Auto-kill rules**: Automatically kill conversations after inactivity

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

4. **Kill/Reactivate not working**
   - Ensure you have admin permissions
   - Check network connectivity
   - Verify conversation ID is valid
   - Look for error messages in the interface

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
- Kill/reactivate actions are logged for audit purposes
- Confirmation dialogs prevent accidental conversation killing

## User Impact of Killed Conversations

When a conversation is killed:

- **User experience**: Users attempting to send messages receive an error message
- **API response**: HTTP 403 with message "This conversation has been closed and cannot accept new messages"
- **No data loss**: All existing messages remain visible and accessible
- **Reversible**: Admins can reactivate conversations at any time
- **Transparent**: Users understand why they cannot send messages