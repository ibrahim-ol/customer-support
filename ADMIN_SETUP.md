# Admin System Setup

This document describes the admin authentication system for the AI Customer Support application.

## Overview

The admin system provides a secure login interface for administrators to access the admin dashboard and manage the application.

## Features

- **Secure Login**: Username/password authentication with session management
- **Session Management**: HTTP-only cookies with secure settings
- **Admin Dashboard**: Clean interface with system overview and quick actions
- **Authentication Middleware**: Protects admin routes from unauthorized access

## Routes

### Public Routes
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Handle login form submission

### Protected Routes (require authentication)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/logout` - Logout and clear session

## Authentication

### Default Credentials
- **Username**: `admin` (configurable via `ADMIN_USERNAME` env var)
- **Password**: `admin123` (configurable via `ADMIN_PASSWORD` env var)

### Environment Variables
```bash
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

### Session Management
- Sessions are stored in memory (replace with Redis/database for production)
- HTTP-only cookies with 1-hour expiration
- Secure cookie settings (SameSite=Strict, HttpOnly)

## File Structure

```
src/
├── frontend/pages/
│   ├── admin-login/
│   │   ├── admin-login.tsx    # Login page component
│   │   └── index.tsx          # Export file
│   └── admin-dashboard.tsx    # Dashboard component
├── middleware/
│   └── auth.ts                # Authentication middleware
└── routes/admin/
    └── route.tsx              # Admin route handlers
```

## Components

### AdminLoginView
- Clean login form with username/password fields
- Error handling for invalid credentials and missing fields
- Black and white theme matching the chat interface
- Sharp borders and minimal styling consistent with app design

### AdminDashboardView
- Overview dashboard with stats cards using black borders
- Quick action buttons with hover effects
- Recent activity section (placeholder)
- Header with logout functionality
- Consistent black and white theme throughout

### Authentication Middleware
- `requireAdminAuth`: Protects routes requiring admin access
- `setAdminSession`: Creates new admin session
- `clearAdminSession`: Destroys session and clears cookies

## Security Considerations

### Current Implementation
- Simple username/password authentication
- In-memory session storage
- HTTP-only cookies with secure flags

### Production Recommendations
1. **Password Hashing**: Use bcrypt or similar for password storage
2. **Session Storage**: Use Redis or database instead of in-memory storage
3. **HTTPS Only**: Set `secure: true` on cookies in production
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **CSRF Protection**: Add CSRF tokens to forms
6. **Audit Logging**: Log admin actions and login attempts

## Usage

1. **Access Admin Panel**: Navigate to `/admin/login`
2. **Login**: Use admin credentials (default: admin/admin123)
3. **Dashboard**: Access admin features from `/admin/dashboard`
4. **Logout**: Click logout button or visit `/admin/logout`

## Development

### Adding New Admin Routes
1. Create route handler in `src/routes/admin/route.tsx`
2. Protect with `requireAdminAuth` middleware
3. Add corresponding frontend components as needed

### Customizing Dashboard
Edit `src/frontend/pages/admin-dashboard.tsx` to add:
- New stat cards
- Additional quick actions
- Real data integration
- New admin features

## Future Enhancements

- [ ] User management interface
- [ ] Conversation monitoring
- [ ] System analytics
- [ ] Configuration management
- [ ] Role-based access control
- [ ] Multi-factor authentication
- [ ] Audit logging dashboard
- [ ] Real-time system monitoring

## Troubleshooting

### Common Issues

**Login fails with correct credentials**
- Check environment variables are set correctly
- Verify session storage is working
- Check browser cookies are enabled

**Dashboard not accessible**
- Ensure you're logged in
- Check session hasn't expired
- Verify cookies are set properly

**Styling issues**
- Ensure Tailwind CSS is loaded
- Check for conflicting styles
- Verify black and white theme is applied consistently

### Debug Mode
Add logging to see authentication flow:
```typescript
console.log('Session ID:', sessionId);
console.log('Session valid:', validateSession(sessionId));
```
