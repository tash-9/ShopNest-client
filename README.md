# ShopNest Client

ShopNest Client is the frontend application for the ShopNest e-commerce platform. It enables users to browse products, search and filter by category and price, add items to cart, place orders, and access role-based dashboards for buyers, sellers, and administrators.

## Purpose

The client provides a fully responsive React + TypeScript application for users to:

- Browse and search thousands of products
- Filter by category, price range, and rating
- Add products to cart and place orders
- Register and log in securely
- Manage their own product listings
- Track order history and status
- Access role-based dashboards for buyers, sellers, and admins

---

## 🔗 Live URL

- **Frontend:** [https://shopnest-client.vercel.app](https://shopnest-client.vercel.app)

---

## Features

- Modern responsive e-commerce platform
- Hero slider with call-to-action
- 7+ landing page sections (Categories, Featured Products, Stats, Testimonials, FAQ, Newsletter, Why ShopNest)
- Product listing with search, filter, sort, and pagination
- Product detail page with image gallery, specifications, and related products
- Shopping cart with quantity controls and 2-step checkout
- User registration and JWT-based authentication
- Demo and admin login buttons (auto-fill credentials)
- Role-based dashboard (Admin, Seller, Buyer)
- Profile management
- Add, view, and delete own product listings
- Admin: manage all users, roles, and order statuses
- Admin dashboard with Recharts bar and pie charts
- Order history with expandable detail and progress tracker
- Skeleton loaders while data loads
- Toast notifications
- Mobile, tablet, and desktop responsive layout
- Auto-generated avatar using DiceBear
- Sticky navbar with role-aware links
- Hamburger menu for mobile navigation

---

## Technologies Used

- React 18
- TypeScript
- Vite
- React Router DOM v6
- Axios (with JWT interceptor)
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- Recharts (admin dashboard charts)
- React Hot Toast (notifications)
- React CountUp (animated statistics)
- React Fast Marquee (brand carousel)

## NPM Packages Used

- react
- react-dom
- react-router-dom
- axios
- framer-motion
- react-hot-toast
- react-countup
- recharts
- lucide-react
- react-fast-marquee
- tailwindcss
- autoprefixer
- typescript
- vite

---
```
## Project Structure
src/
├── App.tsx                        # Root component with all routes
├── main.tsx                       # Entry point
├── styles.css                     # Global styles and Tailwind imports
├── components/
│   ├── Navbar.tsx                 # Sticky navbar with role-aware links
│   ├── Footer.tsx                 # Footer with links, contact, social icons
│   ├── ProtectedRoute.tsx         # Auth + role guard for private routes
│   └── ProductCard.tsx            # Reusable product card with skeleton loader
├── contexts/
│   ├── AuthContext.tsx            # Global auth state (login, logout, user)
│   └── CartContext.tsx            # Global cart state with localStorage persistence
├── services/
│   └── api.ts                     # Axios instance with JWT interceptor
├── types/
│   └── index.ts                   # TypeScript interfaces (User, Product, Order)
└── pages/
├── Home.tsx                   # Landing page (7+ sections)
├── Shop.tsx                   # Product listing with filter/search/sort/pagination
├── ProductDetails.tsx         # Single product page
├── Cart.tsx                   # Cart and checkout flow
├── Login.tsx                  # Login form with demo buttons
├── Register.tsx               # Registration form
├── About.tsx                  # About page with team and timeline
├── Contact.tsx                # Contact form
├── NotFound.tsx               # 404 page
└── dashboard/
├── DashboardLayout.tsx    # Sidebar layout for dashboard
├── DashboardHome.tsx      # Stats overview and charts
├── Profile.tsx            # Edit profile
├── AddProduct.tsx         # List a new product
├── ManageProducts.tsx     # View and delete own products
├── MyOrders.tsx           # Buyer order history
├── AllUsers.tsx           # Admin user management
└── AllOrders.tsx          # Admin order management
```
---

## Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home landing page |
| `/shop` | Public | Browse all products |
| `/products/:id` | Public | Single product detail |
| `/login` | Public | Login form |
| `/register` | Public | Create account |
| `/about` | Public | About ShopNest |
| `/contact` | Public | Contact form |
| `/cart` | Protected | Shopping cart and checkout |
| `/dashboard` | Protected | Dashboard overview |
| `/dashboard/profile` | Protected | Edit profile |
| `/dashboard/my-orders` | Protected | Own order history |
| `/dashboard/products/add` | Protected | Add new product |
| `/dashboard/products/manage` | Protected | Manage own products |
| `/dashboard/all-users` | Admin | Manage all users |
| `/dashboard/all-orders` | Admin | Manage all orders |

---

## Local Installation

1. Clone the client repository.

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

App runs at `http://localhost:5173`

> Make sure `shopnest-server` is running on `http://localhost:5000` before starting the client.

---

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## User Roles

| Role | What they can do |
|------|-----------------|
| `buyer` | Browse products, place orders, manage profile |
| `seller` | List and manage own products, place orders |
| `admin` | Full access — manage users, all products, all orders, view analytics |

---

## Demo Credentials
```
Admin Email:    admin@shopnest.com
Admin Password: Admin12345
Demo Email:     demo@shopnest.com
Demo Password:  Demo12345

Use the **Demo User Login** / **Admin Login** buttons on the login page to auto-fill.
```
---

## Author

Tasfia Islam Raisha
