# UI Quick Reference Card

A fast reference for common UI patterns in the AI Customer Support application.

## 🎨 Core Colors
```css
Black:  #000000  (text, borders, buttons)
White:  #ffffff  (backgrounds)
Gray:   #f9fafb  (hover states)
Red:    #b91c1c  (errors only)
```

## 📄 Page Template
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

## 🔘 Buttons
```html
<!-- Primary -->
<button class="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors font-medium border border-black">
  Primary
</button>

<!-- Secondary -->
<button class="bg-white text-black px-4 py-2 border border-black hover:bg-gray-50 transition-colors font-medium">
  Secondary
</button>
```

## 📝 Forms
```html
<!-- Input -->
<input class="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400" />

<!-- Label -->
<label class="block text-sm font-medium text-black mb-2">Label</label>

<!-- Textarea -->
<textarea class="w-full px-4 py-3 border border-black focus:outline-none text-black placeholder-gray-400"></textarea>
```

## 📦 Cards
```html
<!-- Basic Card -->
<div class="bg-white border border-black p-6">
  Content
</div>

<!-- Stats Card -->
<div class="bg-white border border-black p-6">
  <div class="flex items-center">
    <div class="w-8 h-8 bg-black text-white flex items-center justify-center">
      <span class="text-sm font-bold">📊</span>
    </div>
    <div class="ml-4">
      <h3 class="text-sm font-medium text-black">Title</h3>
      <p class="text-2xl font-bold text-black">Value</p>
    </div>
  </div>
</div>
```

## 🚨 Error States
```html
<!-- Standard Error -->
<div class="border border-black bg-white px-4 py-3 text-sm text-black">
  <strong>Error:</strong> Message here
</div>

<!-- Critical Error -->
<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
  Critical error message
</div>
```

## 📱 Grids
```html
<!-- Dashboard Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <!-- Cards -->
</div>

<!-- Action Grid -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <button class="flex flex-col items-center p-4 border border-black hover:bg-gray-50 transition-colors">
    <span class="text-2xl mb-2">🎯</span>
    <span class="text-sm font-medium text-black">Action</span>
  </button>
</div>
```

## ✏️ Typography
```html
<!-- Page Title -->
<h1 class="text-lg font-bold text-black">

<!-- Section Header -->
<h2 class="text-lg font-bold text-black mb-4">

<!-- Body Text -->
<p class="text-sm text-black">

<!-- Small Text -->
<span class="text-xs font-medium text-black">
```

## 📏 Spacing
```css
p-2   = 8px     /* Small padding */
p-4   = 16px    /* Standard padding */
p-6   = 24px    /* Large padding */
mb-4  = 16px    /* Bottom margin */
mb-8  = 32px    /* Section spacing */
gap-4 = 16px    /* Grid gap */
gap-6 = 24px    /* Large grid gap */
```

## 🔗 Links
```html
<a href="/path" class="text-black hover:text-gray-800 font-medium">Link</a>
```

## ❌ Don't Use
- Rounded corners (except `rounded-2xl` for chat)
- Shadows (`shadow-*`)
- Colors other than black/white/gray
- Gradients
- Complex animations

## ✅ Always Use
- Sharp borders (`border border-black`)
- High contrast text
- Semantic HTML elements
- Consistent spacing
- Hover transitions (`transition-colors`)

## 🎯 Quick Checks
- [ ] Black borders everywhere
- [ ] White backgrounds
- [ ] Black text
- [ ] No rounded corners (except chat)
- [ ] Proper hover states
- [ ] Consistent spacing