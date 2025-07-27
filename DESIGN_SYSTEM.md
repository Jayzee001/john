# Design System Customization Guide

This guide explains how to customize the appearance of your e-commerce store by changing colors, fonts, and other design elements.

## 🎨 Quick Color Changes

### Primary Color Scheme

To change your store's primary color scheme, edit the `src/lib/design-system.ts` file:

```typescript
// Current blue theme
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',  // Main brand color
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
}
```

### Pre-built Color Schemes

The design system includes several pre-built color schemes. To use them:

1. **Purple Theme**: Uncomment the purple color block in `design-system.ts`
2. **Green Theme**: Uncomment the green color block
3. **Red Theme**: Uncomment the red color block
4. **Orange Theme**: Uncomment the orange color block

### Custom Color Scheme

To create your own color scheme:

1. Use a color palette generator like [Coolors](https://coolors.co/) or [Adobe Color](https://color.adobe.com/)
2. Replace the primary color values in `design-system.ts`
3. Ensure you have 10 shades (50-950) for consistency

## 🏪 Store Information

Update your store details in `src/lib/design-system.ts`:

```typescript
store: {
  name: 'Your Store Name',
  description: 'Your store description',
  tagline: 'Your store tagline',
},
```

## 🎯 What Gets Updated Automatically

When you change the design system, these elements update automatically:

### Colors
- ✅ Primary buttons
- ✅ Secondary buttons
- ✅ Links and hover states
- ✅ Focus rings
- ✅ Borders
- ✅ Text colors
- ✅ Background colors
- ✅ Status indicators (success, error, warning)

### Components
- ✅ Button component
- ✅ Card component
- ✅ Input component
- ✅ All form elements
- ✅ Navigation elements
- ✅ Product cards
- ✅ Cart items
- ✅ Checkout forms

## 🔧 Advanced Customization

### CSS Variables

All colors are defined as CSS custom properties in `src/app/globals.css`:

```css
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  /* ... more colors */
  
  --button-primary: var(--primary-600);
  --button-primary-hover: var(--primary-700);
  --text-primary: #111827;
  --background: #ffffff;
  /* ... more variables */
}
```

### Dark Mode

Dark mode colors are automatically adjusted based on your primary color scheme. You can customize them in the `@media (prefers-color-scheme: dark)` section of `globals.css`.

### Typography

Update fonts in `src/lib/design-system.ts`:

```typescript
typography: {
  fontFamily: {
    sans: 'var(--font-geist-sans)',  // Change this
    mono: 'var(--font-geist-mono)',  // Change this
  },
}
```

## 🚀 Quick Start Examples

### Example 1: Change to Purple Theme

1. Open `src/lib/design-system.ts`
2. Comment out the current primary colors
3. Uncomment the purple theme
4. Save the file

### Example 2: Change Store Name

1. Open `src/lib/design-system.ts`
2. Update the store name:
   ```typescript
   store: {
     name: 'My Awesome Store',
     description: 'The best online shopping experience',
     tagline: 'Quality products at great prices',
   },
   ```

### Example 3: Custom Brand Colors

1. Open `src/lib/design-system.ts`
2. Replace the primary colors with your brand colors:
   ```typescript
   primary: {
     50: '#f0f9ff',   // Your lightest shade
     100: '#e0f2fe',
     200: '#bae6fd',
     300: '#7dd3fc',
     400: '#38bdf8',
     500: '#0ea5e9',
     600: '#0284c7',  // Your main brand color
     700: '#0369a1',
     800: '#075985',
     900: '#0c4a6e',
     950: '#082f49',  // Your darkest shade
   },
   ```

## 📱 Responsive Design

The design system is fully responsive and works on:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px-1023px)
- ✅ Mobile (320px-767px)

## 🎨 Design Tokens

The system uses consistent design tokens for:
- **Spacing**: xs, sm, md, lg, xl, 2xl
- **Border Radius**: sm, md, lg, xl, full
- **Typography**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **Shadows**: sm, md, lg
- **Colors**: 50-950 shades for each color

## 🔄 Updating Multiple Stores

If you have multiple store replicas:

1. Copy the entire project
2. Update only the `src/lib/design-system.ts` file
3. Change the store name and colors
4. Deploy as a new store

All components will automatically use the new design system!

## 🐛 Troubleshooting

### Colors Not Updating
- Make sure you saved the `design-system.ts` file
- Clear your browser cache
- Restart the development server

### Components Not Styled
- Check that CSS variables are properly defined in `globals.css`
- Ensure components are using the CSS variable syntax: `var(--primary-600)`

### Dark Mode Issues
- Verify dark mode colors are defined in the CSS
- Test with browser dark mode settings

## 📚 Additional Resources

- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Color Accessibility](https://webaim.org/resources/contrastchecker/) 