# OmniMarket Mobile & Web Architecture

OmniMarket is a modern **multi-merchant e-commerce marketplace platform** featuring:
- **Backend**: Express + TypeScript + Prisma + PostgreSQL (with transactional multi-merchant order-splitting engine)
- **Frontend**: React + Vite + TypeScript + Tailwind CSS (Responsive Desktop + PWA Mobile)
- **Mobile Platforms**: Native Android & iOS wrapper powered by **Capacitor**

---

## 📱 Mobile App Overview

The mobile application supports all 3 marketplace roles:
1. **Customer**:
   - Native bottom navigation bar (`Home`, `Shop`, `Stores`, `Cart`, `Orders / Profile`)
   - Grouped multi-merchant cart with live badges
   - One-step checkout with Cash on Delivery (COD)
   - Real-time order tracking
2. **Merchant**:
   - Merchant store portal tab
   - Real-time sales metrics & low-stock alerts
   - Inventory manager (Add, Edit, Restock items)
   - Order fulfillment workflow (`PENDING` → `ACCEPTED` → `PREPARING` → `READY` → `DELIVERED`)
3. **Admin**:
   - Admin control panel tab
   - Cross-merchant gross merchandise volume (GMV)
   - Vendor moderation (Approve or suspend merchant stores)
   - Complete buyer & order registries

---

## 🚀 How to Run the Applications

### 1. Web Application & API (Active)
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

To start manually:
```bash
# Start backend
cd server
npm run dev

# Start frontend (in a separate terminal)
cd client
npm run dev
```

### 2. Native Android App (Ready to Build)
The native Android project is generated in `client/android/`.

To open in Android Studio:
```bash
cd client
npx cap open android
```
From Android Studio, you can:
- Run directly on an **Android Emulator** or physical device via USB debugging.
- Generate an **APK** or **Android App Bundle (.aab)** for Google Play (`Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`).

To rebuild the web assets and update Android after making code changes:
```bash
cd client
npm run build
npx cap sync android
```

### 3. Native iOS App (macOS)
If running on macOS with Xcode installed:
```bash
cd client
npm install @capacitor/ios
npx cap add ios
npx cap open ios
```

---

## 🔑 Pre-Seeded Test Accounts

Password for all accounts: **`Password123!`**

- **Customer**: `alex.buyer@gmail.com`
- **Merchant (TechZone)**: `techzone@merchant.com`
- **Merchant (Urban Aura)**: `urbanaura@merchant.com`
- **Admin**: `admin@marketplace.com`

*(One-click login buttons are also provided on the sign-in page for instant testing).*
