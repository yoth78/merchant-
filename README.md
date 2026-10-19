# OmniMarket — Multi-Merchant E-Commerce Marketplace MVP

A modern, production-grade **multi-merchant e-commerce marketplace platform** where multiple independent merchants can register, create storefronts, add products, manage inventory, and receive customer orders. Customers can browse merchants, add items from multiple merchants into one cart, check out once, and track each merchant order independently.

---

## 1. Project Overview & Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                       React + Vite Frontend                 │
│  Tailwind CSS • Zustand • Lucide Icons • Responsive UI      │
│  - Marketplace Catalog & Merchant Storefronts               │
│  - Multi-Merchant Cart & Checkout Wizard                    │
│  - Customer Tracking & Order History                        │
│  - Merchant Portal (Inventory, Orders, Metrics)             │
│  - Admin Control Panel (Governance, Moderation)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (REST API)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js + TypeScript                  │
│  - JWT Bearer Authentication & Role-Based Access Control    │
│  - Zod Request Validation                                   │
│  - Services & Controllers Layer                             │
│  - Transactional Checkout Order-Splitting Engine            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PostgreSQL + Prisma ORM                     │
│  User • Merchant • Category • Product • Cart • CartItem     │
│  Checkout (OrderGroup) • Order • OrderItem • Notification   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Merchant Order Splitting Engine

The core design decision of OmniMarket revolves around the **Checkout / OrderGroup** pattern:

```text
Customer Cart (Multiple Merchants)
  ├── Merchant A: T-Shirt ($20), Jeans ($40)
  ├── Merchant B: Shoes ($60)
  └── Merchant C: Backpack ($30)
                 │
                 ▼ [POST /api/checkouts]
          Checkout #CHK-5001 (Total: $150.00)
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
Order #1001  Order #1002  Order #1003
Merchant A   Merchant B   Merchant C
Subtotal: $60 Subtotal: $60 Subtotal: $30
Status: PEND Status: PEND  Status: PEND
```

### Key Workflow Highlights
1. **Single Checkout Experience**: The customer enters their delivery address and payment method once.
2. **Atomic Transaction**: Cart items are validated for inventory, prices are snapshotted on `OrderItem` records, and stock is decremented immediately.
3. **Merchant Isolation**: Merchant A only sees Order `#1001`; Merchant B only sees Order `#1002`. Neither merchant can access each other's sales or customer notes.
4. **Independent Lifecycle**: Each merchant independently advances their order:
   `PENDING` → `ACCEPTED` → `PREPARING` → `READY` → `DELIVERED`
5. **Unified Customer Tracking**: On the customer's `/orders` view, orders are grouped under their parent checkout session, giving complete real-time tracking across all fulfillment streams.

---

## 3. Seed Accounts & Credentials

The database is pre-seeded with 5 verified merchants, 8 categories, 31 active products, 5 customers, and an administrator.

**Universal password for all test accounts:** `Password123!`

| Role | Email | Name / Store |
| :--- | :--- | :--- |
| **Admin** | `admin@marketplace.com` | Platform Administrator |
| **Merchant 1** | `techzone@merchant.com` | David Vance (TechZone Electronics) |
| **Merchant 2** | `urbanaura@merchant.com` | Elena Rostova (Urban Aura Apparel) |
| **Merchant 3** | `organica@merchant.com` | Marcus Brody (Pure Organics Pantry) |
| **Merchant 4** | `nordichome@merchant.com` | Freja Lind (Nordic Living Co.) |
| **Merchant 5** | `peakpulse@merchant.com` | Kai Takahashi (Peak Pulse Athletics) |
| **Customer 1** | `alex.buyer@gmail.com` | Alex Johnson |
| **Customer 2** | `sarah.miller@gmail.com` | Sarah Miller |

*(Tip: The login page includes 1-click credential buttons for instant testing!)*

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
```
The backend server runs on `http://localhost:5000` and automatically initializes seed data.

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The frontend Vite server runs on `http://localhost:5173`.

---

## 5. API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer or merchant |
| `POST` | `/api/auth/login` | Public | Sign in and receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Get current profile |
| `GET` | `/api/products` | Public | Search and filter catalog |
| `GET` | `/api/products/:id` | Public | Product details |
| `POST` | `/api/products` | Merchant | Create store product |
| `PUT` | `/api/products/:id` | Merchant | Update store product |
| `DELETE` | `/api/products/:id` | Merchant | Delete store product |
| `GET` | `/api/merchants` | Public | List approved merchants |
| `GET` | `/api/merchants/:id` | Public | View merchant storefront |
| `PUT` | `/api/merchants/profile`| Merchant | Update store branding |
| `GET` | `/api/merchant/dashboard`| Merchant | Store sales, low stock alerts |
| `GET` | `/api/merchant/orders` | Merchant | View merchant's incoming orders |
| `PUT` | `/api/merchant/orders/:id/status` | Merchant | Progress order status |
| `GET` | `/api/cart` | Customer | View grouped multi-merchant cart |
| `POST` | `/api/cart/items` | Customer | Add product to cart |
| `PUT` | `/api/cart/items/:id` | Customer | Update item quantity |
| `DELETE`| `/api/cart/items/:id` | Customer | Remove item from cart |
| `POST` | `/api/checkouts` | Customer | **Split multi-merchant cart into orders** |
| `GET` | `/api/checkouts/:id` | Customer/Admin | View checkout order group |
| `GET` | `/api/orders` | Customer | View all customer orders |
| `GET` | `/api/orders/:id` | Customer | View order status detail |
| `GET` | `/api/admin/stats` | Admin | Overall marketplace analytics |
| `GET` | `/api/admin/merchants` | Admin | Review & moderate stores |
| `PUT` | `/api/admin/merchants/:id/status` | Admin | Approve or suspend merchant |
