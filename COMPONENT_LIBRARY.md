# Component Library Reference

A comprehensive reference of all reusable UI components in the AI Customer Support application, following the black and white design system.

## Base Layout Components

### BaseLayout
The foundation wrapper for all pages.

```tsx
import { BaseLayout } from "../utils/view.tsx";

<BaseLayout>
  {/* Page content */}
</BaseLayout>
```

### PageLayout
Standard page structure with header and scrollable content.

```tsx
<BaseLayout>
  <div className="flex flex-col h-screen bg-white">
    <header className="text-black px-4 py-2 border-b border-black">
      <h1 className="text-lg font-bold text-center">Page Title</h1>
    </header>
    <main className="flex-1 overflow-y-auto">
      {/* Page content */}
    </main>
  </div>
</BaseLayout>
```

### AdminHeader
Reusable admin header with logout functionality.

```tsx
<header className="text-black px-4 py-2 border-b border-black">
  <div className="flex justify-between items-center">
    <h1 className="text-lg font-bold">Admin Dashboard</h1>
    <div className="flex items-center space-x-4">
      <span className="text-sm text-black">Welcome, Admin</span>
      <a
        href="/admin/logout"
        className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black"
      >
        Logout
      </a>
    </div>
  </div>
</header>
```

## Button Components

### PrimaryButton
Main action buttons with black background.

```tsx
<button className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black">
  Primary Action
</button>
```

### SecondaryButton
Secondary actions with white background and black border.

```tsx
<button className="bg-white text-black px-4 py-2 border border-black hover:bg-gray-50 transition-colors font-medium">
  Secondary Action
</button>
```

### SmallButton
Compact buttons for inline actions.

```tsx
<button className="bg-black text-white px-4 py-1 hover:bg-gray-800 transition-colors text-xs font-medium border border-black">
  Small Action
</button>
```

### IconButton
Buttons with icons for dashboard actions.

```tsx
<button className="flex flex-col items-center p-4 border border-black hover:bg-gray-50 transition-colors">
  <span className="text-2xl mb-2">🎯</span>
  <span className="text-sm font-medium text-black">Action Name</span>
</button>
```

### DisabledButton
Button in loading or disabled state.

```tsx
<button
  disabled
  className="bg-black text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-black"
>
  Loading...
</button>
```

## Form Components

### TextInput
Standard text input field.

```tsx
<input
  type="text"
  className="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400"
  placeholder="Enter text..."
/>
```

### PasswordInput
Password input with proper type.

```tsx
<input
  type="password"
  className="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400"
  placeholder="Enter password..."
/>
```

### TextArea
Multi-line text input.

```tsx
<textarea
  className="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400 max-h-[300px]"
  rows={2}
  placeholder="Enter message..."
></textarea>
```

### FormLabel
Consistent label styling.

```tsx
<label className="block text-sm font-medium text-black mb-2">
  Field Label
</label>
```

### FormGroup
Complete form field with label and input.

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-black">
    Username
  </label>
  <input
    type="text"
    className="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400"
    placeholder="Enter username"
  />
</div>
```

## Card Components

### BasicCard
Simple card container with border.

```tsx
<div className="bg-white border border-black p-6">
  {/* Card content */}
</div>
```

### StatsCard
Dashboard statistics display card.

```tsx
<div className="bg-white border border-black p-6">
  <div className="flex items-center">
    <div className="flex-shrink-0">
      <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
        <span className="text-sm font-bold">📊</span>
      </div>
    </div>
    <div className="ml-4">
      <h3 className="text-sm font-medium text-black">
        Total Users
      </h3>
      <p className="text-2xl font-bold text-black">
        1,234
      </p>
    </div>
  </div>
</div>
```

### ActionCard
Card with clickable actions.

```tsx
<div className="bg-white border border-black p-6 hover:bg-gray-50 transition-colors cursor-pointer">
  <div className="text-center">
    <span className="text-4xl mb-4 block">📋</span>
    <h3 className="font-medium text-black">Action Title</h3>
    <p className="text-sm text-black mt-2">Description text</p>
  </div>
</div>
```

## Alert Components

### ErrorAlert
Standard error message display.

```tsx
<div className="border border-black bg-white px-4 py-3 text-sm text-black">
  <strong>Error:</strong> Something went wrong
</div>
```

### CriticalErrorAlert
Critical error with red styling.

```tsx
<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
  Critical system error occurred
</div>
```

### FormErrorAlert
Inline form validation errors.

```tsx
<div className="bg-red-50 border
 border-red-200 text-red-700 px-4 py-3 text-sm">
  {error === "invalid_credentials" && "Invalid username or password"}
  {error === "missing_fields" && "Please fill in all fields"}
</div>
```

## Layout Components

### Container
Maximum width container for content.

```tsx
<div className="max-w-7xl mx-auto p-6">
  {/* Content */}
</div>
```

### Grid2
Two-column responsive grid.

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Grid items */}
</div>
```

### Grid3
Three-column responsive grid.

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

### Grid4
Four-column responsive grid.

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Grid items */}
</div>
```

### FlexBetween
Flex container with space-between alignment.

```tsx
<div className="flex justify-between items-center">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

### FlexCenter
Centered flex container.

```tsx
<div className="flex items-center justify-center">
  {/* Centered content */}
</div>
```

## Typography Components

### PageTitle
Main page heading.

```tsx
<h1 className="text-lg font-bold text-black">
  Page Title
</h1>
```

### SectionTitle
Section heading with bottom margin.

```tsx
<h2 className="text-lg font-bold text-black mb-4">
  Section Title
</h2>
```

### BodyText
Standard body text.

```tsx
<p className="text-sm text-black">
  Body text content
</p>
```

### SmallText
Small text for captions or secondary information.

```tsx
<span className="text-xs font-medium text-black">
  Small text
</span>
```

### Link
Styled text links.

```tsx
<a
  href="/path"
  className="text-black hover:text-gray-800 font-medium"
>
  Link Text
</a>
```

## Chat Components

### ChatBubble
Message bubble with rounded corners (exception to theme).

```tsx
<div className="border rounded-2xl border-black p-4 max-w-md">
  <p className="text-black">Message content</p>
</div>
```

### ChatInput
Chat message input form.

```tsx
<form className="relative border rounded-2xl border-black">
  <textarea
    className="px-4 pt-3 pb-8 w-full focus:outline-none max-h-[300px] text-black resize-none"
    placeholder="Type your message..."
    rows={2}
  />
  <button className="text-xs hover:scale-110 hover:-translate-y-0.5 transition-transform absolute right-2 bottom-2 bg-black text-white px-4 py-1 rounded-full">
    Send
  </button>
</form>
```

## Loading States

### LoadingButton
Button with loading state.

```tsx
<button
  disabled={isLoading}
  className="bg-black text-white px-4 py-2 disabled:opacity-50 transition-colors font-medium border border-black"
>
  {isLoading ? "Loading..." : "Submit"}
</button>
```

### LoadingSpinner
Simple text-based loading indicator.

```tsx
<div className="text-center py-8">
  <span className="text-black">Loading...</span>
</div>
```

### EmptyState
Empty state with icon and message.

```tsx
<div className="text-center py-8">
  <span className="text-4xl mb-4 block">📋</span>
  <p className="text-black font-medium">No items to display</p>
  <p className="text-sm text-black mt-2">
    Items will appear here when available
  </p>
</div>
```

## Navigation Components

### HeaderNav
Simple header navigation.

```tsx
<nav className="flex items-center space-x-4">
  <a
    href="/dashboard"
    className="text-black hover:text-gray-800 font-medium"
  >
    Dashboard
  </a>
  <a
    href="/users"
    className="text-black hover:text-gray-800 font-medium"
  >
    Users
  </a>
</nav>
```

### Brea
dcrumb
Navigation breadcrumb trail.

```tsx
<nav className="flex items-center space-x-2 text-sm">
  <a href="/admin" className="text-black hover:text-gray-800">Admin</a>
  <span className="text-black">/</span>
  <span className="text-black font-medium">Dashboard</span>
</nav>
```

## Usage Guidelines

### Component Selection
- Use `PrimaryButton` for main actions
- Use `SecondaryButton` for cancel/secondary actions
- Use `StatsCard` for dashboard metrics
- Use `ErrorAlert` for form validation
- Use `BasicCard` for content containers

### Consistency Rules
- Always use black borders (`border border-black`)
- Maintain consistent spacing (`p-4`, `p-6`, `gap-4`, `gap-6`)
- Use proper semantic HTML elements
- Include hover states on interactive elements
- Follow the typography hierarchy

### Responsive Behavior
- All grids should be responsive (start with 1 column, expand on `md:`)
- Text should remain readable on mobile devices
- Interactive elements should have adequate touch targets
- Forms should stack vertically on mobile

### Accessibility
- All buttons should have descriptive text
- Form inputs should have associated labels
- Maintain high contrast ratios
- Use semantic HTML elements
- Ensure keyboard navigation works

This component library ensures consistent styling and behavior across all parts of the AI Customer Support application while maintaining the clean black and white design aesthetic.