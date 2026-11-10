import bcrypt from 'bcryptjs';
import { db } from './db.js';

export function seedInitialData() {
  const current = db.get();
  if (current.users.length > 0) {
    return; // Already seeded
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Password123!', salt);

  // 1. Admin
  const adminUser = {
    id: 'user-admin-1',
    email: 'admin@marketplace.com',
    passwordHash,
    name: 'Platform Administrator',
    role: 'ADMIN' as const,
    phone: '+1 555-0100',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // 2. Merchants Users & Profiles (5 Merchants)
  const merchantsData = [
    {
      userId: 'user-merchant-1',
      email: 'techzone@merchant.com',
      name: 'David Vance',
      storeName: 'TechZone Electronics',
      description: 'Your premier shop for high-performance laptops, mechanical keyboards, audio gear, and gadgets.',
      phone: '+1 555-0101',
      address: '100 Silicon Way, San Francisco, CA',
      logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&q=80',
    },
    {
      userId: 'user-merchant-2',
      email: 'urbanaura@merchant.com',
      name: 'Elena Rostova',
      storeName: 'Urban Aura Apparel',
      description: 'Contemporary sustainable streetwear, tailored fits, and high quality minimalist apparel.',
      phone: '+1 555-0102',
      address: '45 Fashion Ave, New York, NY',
      logoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
    },
    {
      userId: 'user-merchant-3',
      email: 'organica@merchant.com',
      name: 'Marcus Brody',
      storeName: 'Pure Organics Pantry',
      description: 'Hand-picked artisanal goods, organic snacks, specialty coffees, and pantry essentials.',
      phone: '+1 555-0103',
      address: '12 Green Valley Rd, Portland, OR',
      logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    },
    {
      userId: 'user-merchant-4',
      email: 'nordichome@merchant.com',
      name: 'Freja Lind',
      storeName: 'Nordic Living Co.',
      description: 'Scandinavian minimalist home decor, ceramic tableware, ergonomic lighting and planters.',
      phone: '+1 555-0104',
      address: '78 Pinecrest Blvd, Seattle, WA',
      logoUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80',
    },
    {
      userId: 'user-merchant-5',
      email: 'peakpulse@merchant.com',
      name: 'Kai Takahashi',
      storeName: 'Peak Pulse Athletics',
      description: 'Performance sportswear, running shoes, trekking packs, and recovery equipment.',
      phone: '+1 555-0105',
      address: '32 Mountain Crest Rd, Boulder, CO',
      logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80',
    }
  ];

  // 3. Customers (5 Customers)
  const customersData = [
    {
      id: 'user-customer-1',
      email: 'alex.buyer@gmail.com',
      name: 'Alex Johnson',
      phone: '+1 555-0201'
    },
    {
      id: 'user-customer-2',
      email: 'sarah.miller@gmail.com',
      name: 'Sarah Miller',
      phone: '+1 555-0202'
    },
    {
      id: 'user-customer-3',
      email: 'michael.chang@gmail.com',
      name: 'Michael Chang',
      phone: '+1 555-0203'
    },
    {
      id: 'user-customer-4',
      email: 'olivia.davis@gmail.com',
      name: 'Olivia Davis',
      phone: '+1 555-0204'
    },
    {
      id: 'user-customer-5',
      email: 'liam.wilson@gmail.com',
      name: 'Liam Wilson',
      phone: '+1 555-0205'
    }
  ];

  // Categories (8 Categories)
  const categoriesData = [
    { id: 'cat-1', name: 'Electronics & Gadgets', slug: 'electronics', icon: 'Laptop', description: 'Tech, computers, headphones, accessories' },
    { id: 'cat-2', name: 'Clothing & Fashion', slug: 'fashion', icon: 'Shirt', description: 'Streetwear, jackets, shirts, denim' },
    { id: 'cat-3', name: 'Groceries & Gourmet', slug: 'groceries', icon: 'Apple', description: 'Artisanal coffee, honey, organic snacks' },
    { id: 'cat-4', name: 'Home & Living', slug: 'home-living', icon: 'Home', description: 'Scandinavian decor, lamps, pottery' },
    { id: 'cat-5', name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: 'Activity', description: 'Activewear, trail packs, gym gear' },
    { id: 'cat-6', name: 'Footwear & Shoes', slug: 'footwear', icon: 'Footprints', description: 'Sneakers, running shoes, boots' },
    { id: 'cat-7', name: 'Bags & Luggage', slug: 'bags', icon: 'Briefcase', description: 'Backpacks, messenger bags, travel gear' },
    { id: 'cat-8', name: 'Health & Wellness', slug: 'wellness', icon: 'HeartPulse', description: 'Recovery gear, vitamins, wellness items' }
  ];

  // Assemble Users & Merchants
  const allUsers = [
    adminUser,
    ...merchantsData.map(m => ({
      id: m.userId,
      email: m.email,
      passwordHash,
      name: m.name,
      role: 'MERCHANT' as const,
      phone: m.phone,
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    ...customersData.map(c => ({
      id: c.id,
      email: c.email,
      passwordHash,
      name: c.name,
      role: 'CUSTOMER' as const,
      phone: c.phone,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  ];

  const allMerchants = merchantsData.map((m, idx) => ({
    id: `merchant-${idx + 1}`,
    userId: m.userId,
    storeName: m.storeName,
    description: m.description,
    phone: m.phone,
    address: m.address,
    logoUrl: m.logoUrl,
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    status: 'APPROVED' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  const allCategories = categoriesData.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  // 30+ Products distributed among the 5 merchants
  const productsRaw = [
    // TechZone (Merchant 1)
    { id: 'prod-1', merchantId: 'merchant-1', categoryId: 'cat-1', name: 'Pro Wireless ANC Headphones', description: 'Studio-grade noise cancelling bluetooth headphones with 40h battery.', price: 199.99, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-2', merchantId: 'merchant-1', categoryId: 'cat-1', name: 'Mechanical RGB Gaming Keyboard', description: 'Hot-swappable tactile switches with aluminum frame and RGB backlighting.', price: 129.50, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-3', merchantId: 'merchant-1', categoryId: 'cat-1', name: 'Ultra-Slim 4K External Monitor 27"', description: 'IPS panel with 99% sRGB color gamut, USB-C power delivery 65W.', price: 349.00, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-4', merchantId: 'merchant-1', categoryId: 'cat-1', name: 'Ergonomic Precision Mouse', description: 'Dual wireless bluetooth & 2.4G sensor with sculpted thumb rest.', price: 79.99, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-5', merchantId: 'merchant-1', categoryId: 'cat-1', name: 'MagSafe Fast Wireless Charger Stand', description: '3-in-1 fast charger for iPhone, Apple Watch, and AirPods.', price: 49.99, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-6', merchantId: 'merchant-1', categoryId: 'cat-1', name: 'Smart Fitness Tracker Band', description: 'Waterproof HR & SpO2 health monitor with OLED touch display.', price: 69.00, stock: 18, imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80' },

    // Urban Aura (Merchant 2)
    { id: 'prod-7', merchantId: 'merchant-2', categoryId: 'cat-2', name: 'Heavyweight Oversized Cotton Hoodie', description: '450 GSM French Terry organic cotton hoodie with dropped shoulders.', price: 85.00, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-8', merchantId: 'merchant-2', categoryId: 'cat-2', name: 'Straight-Leg Japanese Selvedge Denim', description: '13.5oz raw indigo denim tailored for durability and classic silhouette.', price: 120.00, stock: 22, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-9', merchantId: 'merchant-2', categoryId: 'cat-2', name: 'Minimalist Relaxed Fit Crewneck Tee', description: 'Silky combed pima cotton t-shirt with ribbed collar.', price: 34.00, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-10', merchantId: 'merchant-2', categoryId: 'cat-2', name: 'Water-Resistant Utility Field Jacket', description: 'Tactical multi-pocket outerwear jacket with concealed hood.', price: 155.00, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-11', merchantId: 'merchant-2', categoryId: 'cat-7', name: 'Canvas Everyday Messenger Bag', description: 'Durable waxed canvas bag with brass hardware and 15" laptop sleeve.', price: 95.00, stock: 28, imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-12', merchantId: 'merchant-2', categoryId: 'cat-2', name: 'Merino Wool Knit Beanie', description: 'Ultra-soft non-itch thermal knit cap in charcoal grey.', price: 28.00, stock: 65, imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80' },

    // Pure Organics Pantry (Merchant 3)
    { id: 'prod-13', merchantId: 'merchant-3', categoryId: 'cat-3', name: 'Single-Origin Ethiopian Yirgacheffe Coffee', description: 'Fresh roasted whole bean specialty coffee with floral notes and lemon zest.', price: 22.50, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-14', merchantId: 'merchant-3', categoryId: 'cat-3', name: 'Raw Organic Wildflower Honey 500g', description: 'Unpasteurized pure honey harvested sustainably from alpine meadows.', price: 18.00, stock: 35, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-15', merchantId: 'merchant-3', categoryId: 'cat-3', name: 'Artisan Cold-Pressed Extra Virgin Olive Oil', description: 'Early harvest Koroneiki olives cold pressed within 6 hours.', price: 29.00, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-16', merchantId: 'merchant-3', categoryId: 'cat-3', name: 'Ceremonial Grade Uji Matcha 50g', description: 'Stone-ground green tea leaves from Kyoto with rich umami flavor.', price: 36.00, stock: 24, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-17', merchantId: 'merchant-3', categoryId: 'cat-3', name: 'Roasted Rosemary & Sea Salt Cashews', description: 'Non-GMO small-batch toasted premium organic cashews.', price: 14.50, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1536591375315-1b83886562ee?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-18', merchantId: 'merchant-3', categoryId: 'cat-3', name: 'Organic Dark Chocolate 85% Bar Pack (3x)', description: 'Single-origin Ecuadorian cocoa beans with subtle bourbon vanilla.', price: 16.50, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80' },

    // Nordic Living (Merchant 4)
    { id: 'prod-19', merchantId: 'merchant-4', categoryId: 'cat-4', name: 'Handcrafted Ceramic Dinnerware Set (4pc)', description: 'Matte glaze stoneware plates and bowls made with artisanal craft.', price: 110.00, stock: 16, imageUrl: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-20', merchantId: 'merchant-4', categoryId: 'cat-4', name: 'Amber Glass Scented Soy Candle', description: 'Notes of cedarwood, smoked amber, and pine. Burns cleanly for 55 hours.', price: 26.00, stock: 70, imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-21', merchantId: 'merchant-4', categoryId: 'cat-4', name: 'Minimalist Dimmable LED Desk Lamp', description: 'Solid oak base and matte brass arm with warm ambient dimming touch controls.', price: 92.00, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-22', merchantId: 'merchant-4', categoryId: 'cat-4', name: 'Linen Throw Blanket in Sandstone', description: '100% pre-washed French flax linen throw with delicate fringe borders.', price: 78.00, stock: 32, imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-23', merchantId: 'merchant-4', categoryId: 'cat-4', name: 'Terracotta Fluted Plant Pot & Saucer', description: 'Natural porous clay pot ensuring optimal soil aeration for indoor plants.', price: 38.00, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-24', merchantId: 'merchant-4', categoryId: 'cat-4', name: 'Natural Oak Geometric Wall Clock', description: 'Silent quartz movement wooden wall clock with minimalist etched markers.', price: 65.00, stock: 18, imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80' },

    // Peak Pulse Athletics (Merchant 5)
    { id: 'prod-25', merchantId: 'merchant-5', categoryId: 'cat-6', name: 'Pro Carbon-Plate Road Running Shoes', description: 'Featherlight marathon racers with nitrogen-infused bounce foam.', price: 185.00, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-26', merchantId: 'merchant-5', categoryId: 'cat-7', name: 'Ultralight 35L Alpine Trail Backpack', description: 'Ripstop nylon pack with integrated hydration reservoir sleeve and rain cover.', price: 140.00, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-27', merchantId: 'merchant-5', categoryId: 'cat-8', name: 'Deep-Tissue Massage Percussion Gun', description: 'Quiet brushless motor with 5 speed levels and 6 interchangeable heads.', price: 119.00, stock: 28, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-28', merchantId: 'merchant-5', categoryId: 'cat-5', name: 'Thermal Insulated Sports Flask 1L', description: 'Vacuum insulated stainless steel water bottle keeping drinks ice cold 24h.', price: 32.00, stock: 55, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-29', merchantId: 'merchant-5', categoryId: 'cat-5', name: 'Non-Slip High Density Yoga Mat', description: 'Eco-friendly natural rubber yoga mat with alignment grid lines.', price: 58.00, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-30', merchantId: 'merchant-5', categoryId: 'cat-5', name: 'Heavy Duty Resistance Band Set (5pc)', description: 'Anti-snap latex workout bands with carabiners, handles, and door anchor.', price: 29.99, stock: 65, imageUrl: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=600&q=80' },
    { id: 'prod-31', merchantId: 'merchant-5', categoryId: 'cat-2', name: 'Breathable Seamless Compression Top', description: 'Sweat-wicking 4-way stretch workout athletic shirt.', price: 42.00, stock: 35, imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80' }
  ];

  const allProducts = productsRaw.map(p => ({
    id: p.id,
    merchantId: p.merchantId,
    categoryId: p.categoryId,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    isActive: true,
    imageUrl: p.imageUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  // Seed sample multi-merchant checkout & split orders
  // Customer 1 bought from TechZone (prod-1) and Urban Aura (prod-7, prod-9)
  const sampleCheckoutId = 'checkout-seed-5001';
  const sampleCheckout = {
    id: sampleCheckoutId,
    orderNumber: 'CHK-5001',
    customerId: 'user-customer-1',
    totalAmount: 318.99, // 199.99 + 85.00 + 34.00
    paymentMethod: 'COD' as const,
    paymentStatus: 'PENDING' as const,
    customerName: 'Alex Johnson',
    customerPhone: '+251 91 123 4567',
    deliveryAddress: 'Koye Feche Condominium, Block 90, 4th Floor, House No. 21 (Entrance B)',
    deliveryNotes: 'Please call on arrival; gate guard will allow entry.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4), // 4 hours ago
    updatedAt: new Date(Date.now() - 3600 * 1000 * 4)
  };

  const sampleOrderTechZone = {
    id: 'order-1001',
    orderNumber: 'ORD-1001',
    checkoutId: sampleCheckoutId,
    customerId: 'user-customer-1',
    merchantId: 'merchant-1',
    subtotal: 199.99,
    deliveryFee: 0,
    totalAmount: 199.99,
    status: 'PREPARING' as const,
    paymentStatus: 'PENDING' as const,
    customerName: 'Alex Johnson',
    customerPhone: '+251 91 123 4567',
    deliveryAddress: 'Koye Feche Condominium, Block 90, 4th Floor, House No. 21 (Entrance B)',
    deliveryNotes: 'Please call on arrival; gate guard will allow entry.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 3)
  };

  const sampleOrderUrbanAura = {
    id: 'order-1002',
    orderNumber: 'ORD-1002',
    checkoutId: sampleCheckoutId,
    customerId: 'user-customer-1',
    merchantId: 'merchant-2',
    subtotal: 119.00,
    deliveryFee: 0,
    totalAmount: 119.00,
    status: 'ACCEPTED' as const,
    paymentStatus: 'PENDING' as const,
    customerName: 'Alex Johnson',
    customerPhone: '+251 91 123 4567',
    deliveryAddress: 'Koye Feche Condominium, Block 90, 4th Floor, House No. 21 (Entrance B)',
    deliveryNotes: 'Please call on arrival; gate guard will allow entry.',
    createdAt: new Date(Date.now() - 3600 * 1000 * 4),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 2)
  };

  const sampleOrderItems = [
    {
      id: 'item-1001-1',
      orderId: 'order-1001',
      productId: 'prod-1',
      productName: 'Pro Wireless ANC Headphones',
      unitPrice: 199.99,
      quantity: 1,
      totalPrice: 199.99,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4)
    },
    {
      id: 'item-1002-1',
      orderId: 'order-1002',
      productId: 'prod-7',
      productName: 'Heavyweight Oversized Cotton Hoodie',
      unitPrice: 85.00,
      quantity: 1,
      totalPrice: 85.00,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4)
    },
    {
      id: 'item-1002-2',
      orderId: 'order-1002',
      productId: 'prod-9',
      productName: 'Minimalist Relaxed Fit Crewneck Tee',
      unitPrice: 34.00,
      quantity: 1,
      totalPrice: 34.00,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4)
    }
  ];

  // Cart for Customer 2 with items from Nordic Living (Merchant 4) and Pure Organics (Merchant 3)
  const sampleCartItems = [
    {
      id: 'cart-item-1',
      cartId: 'cart-user-customer-2',
      productId: 'prod-13', // Coffee
      quantity: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'cart-item-2',
      cartId: 'cart-user-customer-2',
      productId: 'prod-20', // Candle
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const sampleNotifications = [
    {
      id: 'notif-1',
      userId: 'user-merchant-1',
      title: 'New Order Received',
      message: 'New Order #ORD-1001 was placed with 1 item. Subtotal: $199.99',
      isRead: false,
      linkUrl: '/merchant/orders/order-1001',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4)
    },
    {
      id: 'notif-2',
      userId: 'user-merchant-2',
      title: 'New Order Received',
      message: 'New Order #ORD-1002 was placed with 2 items. Subtotal: $119.00',
      isRead: false,
      linkUrl: '/merchant/orders/order-1002',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4)
    },
    {
      id: 'notif-3',
      userId: 'user-customer-1',
      title: 'Order Status Update',
      message: 'Your order #ORD-1002 from Urban Aura Apparel has been ACCEPTED.',
      isRead: false,
      linkUrl: '/orders/order-1002',
      createdAt: new Date(Date.now() - 3600 * 1000 * 2)
    }
  ];

  db.save({
    users: allUsers,
    merchants: allMerchants,
    categories: allCategories,
    products: allProducts,
    cartItems: sampleCartItems,
    checkouts: [sampleCheckout],
    orders: [sampleOrderTechZone, sampleOrderUrbanAura],
    orderItems: sampleOrderItems,
    notifications: sampleNotifications
  });

  console.log('Seed data successfully loaded into local storage database.');
}
