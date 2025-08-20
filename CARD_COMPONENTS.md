# Card Components Documentation

This document describes the reusable card component system for the AI Customer Support admin dashboard, following the black and white design theme.

## Overview

The card component system provides a consistent way to display information and actions across the admin interface. All components follow the established black and white design principles with sharp borders and minimal styling.

## Components

### StatsCard

Displays key metrics and statistics with an icon, title, and value.

#### Props
```typescript
interface StatsCardProps {
  title: string;        // The metric name
  value: string | number; // The metric value
  icon: string;         // Emoji or symbol icon
}
```

#### Usage
```tsx
import { StatsCard } from "../components/cards";

<StatsCard 
  title="Total Conversations" 
  value="1,247" 
  icon="💬" 
/>
```

#### Visual Structure
```
┌─────────────────────────────┐
│ [🎯] Metric Name           │
│      123,456               │
└─────────────────────────────┘
```

### ActionCard

Interactive cards for navigation and actions, supporting both button clicks and links.

#### Props
```typescript
interface ActionCardProps {
  title: string;           // Action title
  description?: string;    // Optional description text
  icon: string;           // Emoji or symbol icon
  onClick?: () => void;   // Button click handler
  href?: string;          // Navigation link
}
```

#### Usage
```tsx
import { ActionCard } from "../components/cards";

// As a button
<ActionCard
  title="Export Data"
  description="Download reports"
  icon="📤"
  onClick={() => console.log("Export clicked")}
/>

// As a link
<ActionCard
  title="User Management"
  description="Manage accounts"
  icon="👥"
  href="/admin/users"
/>
```

#### Visual Structure
```
┌─────────────────┐
│       🎯        │
│   Action Name   │
│  Description    │
└─────────────────┘
```

### ContentCard

A flexible container card with optional title and custom content.

#### Props
```typescript
interface ContentCardProps {
  title?: string;         // Optional card title
  children: ReactNode;    // Card content
  className?: string;     // Additional CSS classes
}
```

#### Usage
```tsx
import { ContentCard } from "../components/cards";

<ContentCard title="Recent Activity">
  <div>Custom content goes here</div>
</ContentCard>

// Without title
<ContentCard>
  <div>Content without header</div>
</ContentCard>
```

#### Visual Structure
```
┌─────────────────────────────┐
│ Title                       │ ← Optional header with border
├─────────────────────────────┤
│                             │
│ Custom content area         │
│                             │
└─────────────────────────────┘
```

### EmptyState

Displays empty states with icon, message, and optional action button.

#### Props
```typescript
interface EmptyStateProps {
  icon: string;           // Display icon
  title: string;          // Main message
  description?: string;   // Optional description
  action?: {             // Optional action button
    text: string;
    href?: string;        // Navigation link
    onClick?: () => void; // Button handler
  };
}
```

#### Usage
```tsx
import { EmptyState } from "../components/cards";

<EmptyState
  icon="📋"
  title="No recent activity"
  description="Activity will appear here as users interact"
  action={{
    text: "View All Activity",
    href: "/admin/activity"
  }}
/>
```

#### Visual Structure
```
        📋
  No Data Available
Optional description text
   [Action Button]
```

## Implementation Examples

### Dashboard Stats Row
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <StatsCard title="Total Users" value="1,247" icon="👥" />
  <StatsCard title="Active Sessions" value="89" icon="🟢" />
  <StatsCard title="Response Time" value="2.3s" icon="⚡" />
  <StatsCard title="Satisfaction" value="94%" icon="⭐" />
</div>
```

### Action Grid
```tsx
<ContentCard>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <ActionCard title="Manage Users" icon="👥" href="/admin/users" />
    <ActionCard title="View Logs" icon="📋" href="/admin/logs" />
    <ActionCard title="Settings" icon="⚙️" href="/admin/settings" />
    <ActionCard title="Export" icon="📤" onClick={handleExport} />
  </div>
</ContentCard>
```

### Two-Column Layout
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <ContentCard title="Recent Activity">
    {/* Activity list */}
  </ContentCard>
  
  <ContentCard title="Quick Stats">
    {/* Statistics */}
  </ContentCard>
</div>
```

### Empty State with Action
```tsx
<ContentCard title="System Alerts">
  <EmptyState
    icon="✅"
    title="All systems operational"
    description="No alerts at this time"
    action={{
      text: "View System Status",
      href: "/admin/status"
    }}
  />
</ContentCard>
```

## Styling Guidelines

### Consistent Patterns
- All cards use `bg-white border border-black`
- Padding follows `p-6` standard
- Icons are contained in `w-8 h-8 bg-black text-white` squares
- Hover states use `hover:bg-gray-50 transition-colors`

### Typography
- Card titles: `text-lg font-bold text-black`
- Stat values: `text-2xl font-bold text-black`
- Descriptions: `text-sm text-black`
- Action text: `text-sm font-medium text-black`

### Spacing
- Grid gaps: `gap-4` for dense layouts, `gap-6` for spacious
- Internal spacing: `space-y-4` for vertical lists
- Margins: `mb-4` for section spacing, `mb-8` for major sections

## Best Practices

### When to Use Each Component

**StatsCard**
- Displaying numerical metrics
- Dashboard KPIs
- System status indicators
- Performance counters

**ActionCard**
- Navigation to other pages
- Triggering actions (export, backup, etc.)
- Quick access to features
- Menu-like interfaces

**ContentCard**
- Grouping related content
- Creating sections with headers
- Containing lists or tables
- Custom layouts that need borders

**EmptyState**
- No data scenarios
- Loading placeholders
- Error states with recovery actions
- Success messages with next steps

### Responsive Behavior
```tsx
// Mobile-first responsive grids
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* 1 column on mobile, 3 on tablet+ */}
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* 2 columns on mobile, 4 on tablet+ */}
</div>
```

### Accessibility
- All interactive cards should be keyboard accessible
- Use semantic HTML (buttons for actions, links for navigation)
- Provide adequate contrast ratios
- Include descriptive text for screen readers

### Performance
- Components are lightweight with minimal props
- No complex state management within cards
- Efficient re-rendering through simple prop changes
- Static imports prevent bundle bloat

## File Structure
```
src/frontend/components/cards/
├── index.tsx           # Export all components
├── stats-card.tsx      # StatsCard component
├── action-card.tsx     # ActionCard component
├── content-card.tsx    # ContentCard component
└── empty-state.tsx     # EmptyState component
```

## Integration Examples

### Admin Dashboard
The main admin dashboard uses all card types:
- StatsCard for metrics display
- ActionCard for quick actions
- ContentCard for content sections  
- EmptyState for empty activity feed

### Enhanced Dashboard
Shows advanced usage patterns:
- Multi-row stats with different data
- Complex action grids with descriptions
- Two-column layouts with ContentCard
- Mixed content types within cards

This card system ensures consistent UI patterns while maintaining flexibility for different use cases across the admin interface.