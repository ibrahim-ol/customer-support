# AI Customer Support - Documentation Summary

A comprehensive overview of the AI Customer Support application's architecture, design system, and components.

## 🎯 Project Overview

An AI-powered customer support system with telegram bot integration, featuring:
- **AI Chat Interface**: Real-time conversations with intelligent responses
- **Admin Dashboard**: Management interface with conversation monitoring
- **Mood/Interest Analysis**: Customer sentiment evaluation and admin alerts
- **Conversation Handover**: Seamless transition from AI to human support

### Core Features
- FAQ answering and service marketing
- Customer mood and interest evaluation
- Admin conversation takeover with AI assistance
- Critical conversation escalation alerts
- Response suggestions based on customer analysis

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
- **Routes**: `/admin/login`, `/admin/dashboard`, `/admin/logout`

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

<!-- Password -->
<input type="password" class="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400">

<!-- Textarea -->
<textarea class="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400 max-h-[300px]" rows="2"></textarea>

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

### Form Validation Errors
```html
<!-- Login errors -->
{error === "invalid_credentials" && "Invalid username or password"}
{error === "missing_fields" && "Please fill in all fields"}
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
├── middleware/        # Authentication & validation
├── services/          # Business logic & AI integration
└── db/               # Database schema & queries
```

## 📋 Component Library

### Essential Components
- **BaseLayout**: Foundation wrapper for all pages
- **ChatLayout**: Standard chat page structure
- **AdminHeader**: Consistent admin navigation
- **StatsCard**: Dashboard metrics display
- **ActionCard**: Interactive buttons with icons
- **ContentCard**: Flexible content containers
- **EmptyState**: No-data placeholders

### Complete Component Patterns

#### Admin Header with Logout
```html
<header class="text-black px-4 py-2 border-b border-black">
  <div class="flex justify-between items-center">
    <h1 class="text-lg font-bold">Admin Dashboard</h1>
    <div class="flex items-center space-x-4">
      <span class="text-sm text-black">Welcome, Admin</span>
      <a href="/admin/logout" class="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium">
        Logout
      </a>
    </div>
  </div>
</header>
```

#### Chat Interface Pattern
```html
<!-- Chat message input with auto-expand -->
<form class="relative border rounded-2xl border-black">
  <textarea class="px-4 pt-3 pb-8 w-full focus:outline-none max-h-[300px] text-black resize-none" rows="2"></textarea>
  <button class="text-xs hover:scale-110 hover:-translate-y-0.5 transition-transform absolute right-2 bottom-2 bg-black text-white px-4 py-1 rounded-full">
    Send
  </button>
</form>
```

#### Loading and Disabled States
```html
<!-- Loading button -->
<button disabled class="bg-black text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
  Loading...
</button>

<!-- Loading indicator -->
<div class="text-center py-8">
  <span class="text-black">Loading...</span>
</div>
```

### Quick Reference
All components follow black/white theme with consistent spacing (`p-4`, `p-6`), sharp borders (`border-black`), and semantic HTML structure.

## 🔐 Security Considerations

### Current Implementation
- Simple username/password authentication with in-memory session storage
- HTTP-only cookies with secure flags (SameSite=Strict, HttpOnly)
- 1-hour session expiration

### Production Recommendations
- [ ] **Password Hashing**: Use bcrypt for password storage
- [ ] **Session Storage**: Replace in-memory with Redis/database
- [ ] **HTTPS Only**: Set `secure: true` on cookies
- [ ] **Rate Limiting**: Prevent brute force attacks
- [ ] **CSRF Protection**: Add CSRF tokens to forms
- [ ] **Audit Logging**: Log admin actions and login attempts

## 🎯 Future Enhancements

### Planned Features
- [ ] Advanced mood classification (classify conversation tone)
- [ ] Conversation summarization (keep token size in check)
- [ ] Real-time admin notifications for critical conversations
- [ ] Role-based access control

### AI Components to Build
- **Classifier**: Tone evaluation based on conversation flow
- **Summarizer**: Conversation summarization for token management
- **Response Suggester**: Generate context-aware reply suggestions
- **Mood Evaluator**: Customer sentiment analysis for admin insights

---

**Development Workflow**: Check existing components first → Follow standard patterns → Maintain theme consistency → Document new patterns when created
