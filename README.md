John E-commerce Store

A modern, full-featured e-commerce application built with Next.js, TypeScript, and Tailwind CSS. This application includes both customer-facing features and a comprehensive admin panel.

## 🚀 Features

### Customer Side
- **Product Browsing**: Browse products with search and category filtering
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: Complete checkout with Stripe payment integration
- **User Authentication**: Secure login/logout with role-based access
- **User Profile**: Manage addresses and view order history
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Panel
- **Dashboard**: Overview of store performance with key metrics
- **Product Management**: Add, edit, delete, and publish/unpublish products
- **Order Management**: View and update order statuses
- **User Management**: View and manage customer accounts
- **Protected Routes**: Secure admin access with authentication
- **Real-time Stats**: Live statistics and analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom design system with reusable components
- **Authentication**: React Context with localStorage (mock implementation)
- **Payment**: Stripe integration (mock implementation)
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context for cart and authentication

## 🎨 Design System

The application uses a comprehensive design system with:
- Customizable color schemes (Blue, Purple, Green, Red, Orange themes)
- Consistent typography and spacing
- Reusable UI components (Button, Card, Input)
- CSS variables for easy theming
- Responsive breakpoints

## 📁 Project Structure

```
John/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── login/         # Admin login
│   │   │   ├── products/      # Product management
│   │   │   ├── orders/        # Order management
│   │   │   └── users/         # User management
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout process
│   │   ├── product/           # Product detail pages
│   │   └── profile/           # User profile
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Design system components
│   ├── contexts/             # React Context providers
│   ├── lib/                  # Utilities and data
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd john
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

### Customer Login
- **Email**: `user@example.com`
- **Password**: `password`

### Admin Login
- **Email**: `admin@john.com`
- **Password**: `admin123`

## 🛍️ Shopping Experience

1. **Browse Products**: Visit the homepage to see featured products
2. **Search & Filter**: Use the search bar and category filters
3. **Add to Cart**: Click "Add to Cart" on any product
4. **View Cart**: Click the cart icon to review your items
5. **Checkout**: Proceed to checkout and complete your purchase
6. **Track Orders**: View order history in your profile

## 👨‍💼 Admin Features

1. **Dashboard**: View store performance metrics
2. **Products**: Manage your product catalog
   - Add new products
   - Edit existing products
   - Publish/unpublish products
   - Delete products
3. **Orders**: Track and manage customer orders
   - View order details
   - Update order status
   - Filter by status
4. **Users**: Manage customer accounts
   - View user information
   - Track user activity

## 🎨 Customization

### Changing Colors
Edit `src/lib/design-system.ts` to customize your store's appearance:

```typescript
// Change primary colors
colors: {
  primary: {
    500: '#your-color-here',
    // ... other shades
  }
}
```

### Adding New Themes
Uncomment and modify the alternative color schemes in the design system file.

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Adaptive layouts

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure
- **Components**: Reusable UI components in `src/components/ui/`
- **Pages**: Route-based pages in `src/app/`
- **Contexts**: State management in `src/contexts/`
- **Types**: TypeScript definitions in `src/types/`
- **Data**: Mock data and services in `src/lib/`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
