# Eversol Backend API

Backend API server for the Eversol E-commerce Admin Dashboard.

## Features

- JWT-based authentication for Admin and Users
- MongoDB database with Mongoose ODM
- RESTful API endpoints
- Role-based access control
- Admin dashboard APIs (analytics, orders, products, customers, coupons, banners, reviews)

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/eversol
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5001`

## API Endpoints

### Authentication
- `POST /api/auth/admin/register` - Register admin
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/user/register` - Register user
- `POST /api/auth/user/login` - User login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin Routes (Requires Admin Authentication)
- `GET /api/admin/analytics/overview` - Get dashboard analytics
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get single order
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/customers` - Get all customers
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `GET /api/admin/coupons` - Get all coupons
- `POST /api/admin/coupons` - Create coupon
- `GET /api/admin/banners` - Get all banners
- `POST /api/admin/banners` - Create banner
- `GET /api/admin/reviews` - Get all reviews
- `PUT /api/admin/reviews/:id/approve` - Approve review

## Database Models

- **User** - Admin and customer users
- **Product** - Product inventory
- **Category** - Product categories
- **Order** - Customer orders
- **Coupon** - Discount coupons
- **Banner** - Hero banners and promotional images
- **Review** - Product reviews

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Type check without building


