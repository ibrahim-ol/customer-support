# UI Themes & Design System

This document defines the design system and theming guidelines for the AI Customer Support application. All components should follow these guidelines to maintain visual consistency.

## Design Philosophy

The application follows a **minimalist black and white design philosophy** with:
- Clean, sharp aesthetics
- High contrast for accessibility
- Consistent spacing and typography
- Minimal use of color (only black, white, and grayscale)
- Sharp borders with no rounded corners
- No shadows or gradients

## Color Palette

### Primary Colors
```css
--color-black: #000000      /* Primary text, borders, buttons */
--color-white: #ffffff      /* Backgrounds, button text */
```

### Grayscale
```css
--color-gray-50: #f9fafb    /* Subtle hover backgrounds */
--color-gray-400: #9ca3af   /* Placeholder text */
--color-gray-800: #1f2937   /* Button hover states */
```

### Accent Colors (Use Sparingly)
```css
--color-red-700: #b91c1c    /* Error states only */
--color-red-50: #fef2f2     /* Error backgrounds only */
--color-red-200: #fecaca    /* Error borders only */
```

## Typography

### Font Stack
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Text Hierarchy
```css
/* Page Titles */
.page-title {
  font-size: 1.125rem;  /* text-lg */
  font-weight: 700;     /* font-bold */
  color: #000000;
}

/* Section Headers */
.section-header {
  font-size: 1.125rem;  /* text-lg */
  font-weight: 700;     /* font-bold */
  color: #000000;
}

/* Body Text */
.body-text {
  font-size: 0.875rem;  /* text-sm */
  font-weight: 400;     /* font-normal */
  color: #000000;
}

/* Small Text */
.small-text {
  font-size: 0.75rem;   /* text-xs */
  font-weight: 500;     /* font-medium */
  color: #000000;
}
```

## Layout Components

### Page Structure
All pages should follow this consistent structure:

```html
<div class="flex flex-col h-screen bg-white">
  <header class="text-black px-4 py-2 border-b border-black">
    <!-- Header content -->
  </header>
  <main class="flex-1 overflow-y-auto">
    <!-- Page content -->
  </main>
</div>
```

### Header Component
```html
<header class="text-black px-4 py-2 border-b border-black">
  <h1 class="text-lg font-bold text-center">Page Title</h1>
</header>
```

### Content Containers
```html
<!-- Main content wrapper -->
<div class="max-w-7xl mx-auto p-6">
  <!-- Content here -->
</div>

<!-- Card containers -->
<div class="bg-white border border-black p-6">
  <!-- Card content -->
</div>
```

## Interactive Elements

### Buttons

#### Primary Button
```html
<button class="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black">
  Button Text
</button>
```

#### Secondary Button
```html
<button class="bg-white text-black px-4 py-2 border border-black hover:bg-gray-50 transition-colors font-medium">
  Button Text
</button>
```

#### Small Button
```html
<button class="bg-black text-white px-4 py-1 hover:bg-gray-800 transition-colors text-xs font-medium border border-black">
  Small Button
</button>
```

### Form Elements

#### Text Input
```html
<input class="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400" 
       placeholder="Enter text..." />
```

#### Textarea
```html
<textarea class="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400" 
          placeholder="Enter message..."></textarea>
```

#### Form Labels
```html
<label class="block text-sm font-medium text-black mb-2">Label Text</label>
```

### Links
```html
<a href="/path" class="text-black hover:text-gray-800 font-medium">Link Text</a>
```

## Specific Component Patterns

### Chat Interface
- White background with black text
- Black borders for message containers
- Rounded borders only for chat bubbles: `rounded-2xl`
- Input fields with sharp borders

### Admin Interface
- Consistent header structure across all admin pages
- Stats cards with black borders, no shadows
- Grid layouts for dashboard elements
- Action buttons in consistent rows/grids

### Error States
```html
<div class="border border-black bg-white px-4 py-3 text-sm text-black">
  <strong>Error:</strong> Error message here
</div>

<!-- For critical errors -->
<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
  Critical error message
</div>
```

### Loading States
```html
<!-- Disabled button -->
<button class="bg-black text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
  Loading...
</button>
```

## Spacing System

### Padding/Margin Scale
```css
/* Use Tailwind's spacing scale */
p-1  = 0.25rem (4px)
p-2  = 0.5rem  (8px)
p-3  = 0.75rem (12px)
p-4  = 1rem    (16px)
p-6  = 1.5rem  (24px)
p-8  = 2rem    (32px)
```

### Component Spacing
- **Form elements**: `space-y-6` between form groups
- **Cards**: `gap-6` in grid layouts
- **Buttons**: `space-x-4` for button groups
- **Content sections**: `mb-8` between major sections

## Border Guidelines

### Border Styles
- **All borders**: Always use `border-black`
- **No rounded corners**: Except for chat bubbles (`rounded-2xl`)
- **Consistent width**: Always `border` (1px), never `border-2` or thicker

### Border Applications
```css
/* Cards and containers */
border border-black

/* Input focus states */
focus:outline-none

/* No box shadows */
/* Never use shadow-* classes */
```

## Animation & Transitions

### Allowed Transitions
```css
/* Hover effects */
transition-colors
hover:bg-gray-50
hover:bg-gray-800

/* Transform effects (minimal use) */
hover:scale-110
hover:-translate-y-0.5
transition-transform
```

### Prohibited Animations
- No fade-ins/fade-outs
- No slide animations
- No rotation effects
- No complex keyframe animations

## Accessibility

### Contrast Requirements
- Black text on white backgrounds (21:1 ratio)
- Maintain high contrast for all interactive elements
- Use proper semantic HTML elements

### Focus States
- All interactive elements must have visible focus states
- Use `focus:outline-none` with custom focus indicators if needed

## Component Examples

### Dashboard Stats Card
```html
<div class="bg-white border border-black p-6">
  <div class="flex items-center">
    <div class="flex-shrink-0">
      <div class="w-8 h-8 bg-black text-white flex items-center justify-center">
        <span class="text-sm font-bold">📊</span>
      </div>
    </div>
    <div class="ml-4">
      <h3 class="text-sm font-medium text-black">Stat Name</h3>
      <p class="text-2xl font-bold text-black">123</p>
    </div>
  </div>
</div>
```

### Action Button Grid
```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <button class="flex flex-col items-center p-4 border border-black hover:bg-gray-50 transition-colors">
    <span class="text-2xl mb-2">🎯</span>
    <span class="text-sm font-medium text-black">Action</span>
  </button>
</div>
```

## Development Guidelines

### CSS Class Naming
- Use Tailwind utility classes exclusively
- Avoid custom CSS unless absolutely necessary
- Group related classes logically
- Use consistent patterns across components

### Component Consistency
- All pages should use the same header structure
- Form styling should be identical across the app
- Button styles should be consistent
- Error handling should follow the same pattern

### Responsive Design
- Mobile-first approach
- Use `md:` and `lg:` breakpoints for larger screens
- Ensure touch targets are adequate (minimum 44px)
- Test on various screen sizes

## Implementation Checklist

When creating new components, verify:

- [ ] Uses only black, white, and gray colors
- [ ] Follows the standard page layout structure
- [ ] Uses consistent typography scale
- [ ] Has proper border styling (black, sharp corners)
- [ ] Includes appropriate hover states
- [ ] Maintains high contrast ratios
- [ ] Uses semantic HTML elements
- [ ] Follows spacing guidelines
- [ ] Is responsive across device sizes
- [ ] Matches existing component patterns

## Anti-Patterns

### Avoid These Styles
```css
/* Never use */
border-radius: /* except for chat bubbles */
box-shadow: any;
background: gradients;
color: any-color-except-grayscale;
rounded-* /* except rounded-2xl for chat */
shadow-*
```

### Never Use These Colors
- Blue, red, green, yellow (except red for errors)
- Any accent colors from Tailwind's palette
- Custom color values

This theme system ensures a cohesive, professional, and accessible user interface across all components of the AI Customer Support application.