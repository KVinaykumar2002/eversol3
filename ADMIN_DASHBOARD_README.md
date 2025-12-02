# Eversol Admin Dashboard

A fully responsive, modern, and visually stunning admin dashboard for managing an e-commerce website that sells oils, pickles, spices, and related food items.

## Features

### ✅ Authentication & Authorization
- Separate authentication systems for Admin and Users
- Secure admin login/register pages
- JWT-based authentication with role-based access control
- Admin-only route protection

### ✅ Admin Dashboard Features

#### Overview Analytics Panel
- Total sales, orders, customers, and revenue
- Best-selling categories visualization
- Low-stock product alerts
- Sales graphs (daily/weekly/monthly) with smooth animations
- Real-time metrics and trends

#### Order Management
- View all orders with detailed information
- Update order status (pending, processing, shipped, delivered, cancelled)
- Filter orders by date and status
- Order details modal with full information

#### Customer Management
- View all customers
- Customer order history
- Total spending per customer
- Search and filter functionality

#### Product Inventory Management
- Add/edit/delete products
- Manage categories (oils, pickles, spices, etc.)
- Upload product images (via URL)
- Set prices, stock, descriptions
- SKU management
- Product tags
- Active/inactive status

#### Coupon & Discount Management
- Create and manage discount coupons
- Percentage or fixed amount discounts
- Set validity dates and usage limits
- Track coupon usage

#### Banner/Hero Section Management
- Create and manage promotional banners
- Set banner positions (hero, top, middle, bottom)
- Upload banner images
- Link banners to pages/products
- Display order management

#### Review Moderation System
- View all product reviews
- Approve or hide reviews
- Delete inappropriate reviews
- Filter by approval status

### ✅ UI/UX Features
- Beautiful, modern dashboard layout
- Smooth animations using Framer Motion
- Collapsible sidebar navigation with icons
- Light & dark mode support
- Clean typography, spacing, and card layouts
- Fully responsive (mobile, tablet, desktop)
- Toast notification system
- Loading states and error handling

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts and graphs
- **Radix UI** - Accessible UI components
- **Sonner** - Toast notifications
- **next-themes** - Dark mode support

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/eversol
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start MongoDB (if running locally):
```bash
# Make sure MongoDB is running on your system
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Create a `.env.local` file (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Accessing the Admin Dashboard

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000/admin/login`
3. Register a new admin account (or use existing credentials)
4. Login to access the admin dashboard

## Admin Dashboard Routes

- `/admin` - Dashboard overview with analytics
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/customers` - Customer management
- `/admin/categories` - Category management
- `/admin/coupons` - Coupon management
- `/admin/banners` - Banner management
- `/admin/reviews` - Review moderation
- `/admin/login` - Admin login page

## Project Structure

```
organic-mandya-e-commerce-solution/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── Category.ts
│   │   │   ├── Coupon.ts
│   │   │   ├── Banner.ts
│   │   │   └── Review.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── admin/
│   │   │       ├── analytics.ts
│   │   │       ├── orders.ts
│   │   │       ├── products.ts
│   │   │       ├── customers.ts
│   │   │       ├── categories.ts
│   │   │       ├── coupons.ts
│   │   │       ├── banners.ts
│   │   │       └── reviews.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── admin/
    │   │       ├── layout.tsx
    │   │       ├── login/
    │   │       │   └── page.tsx
    │   │       ├── page.tsx (dashboard)
    │   │       ├── products/
    │   │       ├── orders/
    │   │       ├── customers/
    │   │       ├── categories/
    │   │       ├── coupons/
    │   │       ├── banners/
    │   │       └── reviews/
    │   ├── components/
    │   │   └── admin/
    │   │       ├── AdminSidebar.tsx
    │   │       └── AdminHeader.tsx
    │   └── lib/
    │       └── api.ts
    └── package.json
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Admin-only route protection
- Secure cookie handling
- Input validation

## Future Enhancements

- Image upload functionality (currently using URLs)
- Activity logs for admin actions
- Advanced analytics and reporting
- Email notifications
- Export data to CSV/Excel
- Bulk operations
- Advanced search and filters

## License

This project is part of the Eversol E-commerce solution.


