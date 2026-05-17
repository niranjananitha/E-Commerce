import { db, rtdb } from './config';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, get } from 'firebase/database';

// ── Local fallback products (shown instantly if Firestore is blocked/slow) ──
export const LOCAL_PRODUCTS = [
  {
    id: 'local-1',
    name: "Ultra-Slim 4K OLED Monitor with HDR10 Support, 27-inch",
    description: "Experience true blacks and vibrant colors with our latest OLED technology. Perfect for creative professionals and gamers alike.",
    price: 45000,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"],
    rating: 4.8, reviewCount: 124, stock: 15, badge: "Best Seller"
  },
  {
    id: 'local-2',
    name: "Wireless Noise-Cancelling Over-Ear Headphones, Silver Edition",
    description: "High-fidelity sound with 40-hour battery life. Designed for comfort and long listening sessions.",
    price: 12000,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    rating: 4.6, reviewCount: 89, stock: 25
  },
  {
    id: 'local-3',
    name: "Men's Classic Leather Biker Jacket, Genuine Cowhide Leather",
    description: "Handcrafted genuine leather jacket. Timeless style that ages beautifully.",
    price: 8500,
    category: "Clothing",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"],
    rating: 4.5, reviewCount: 56, stock: 10, badge: "Sale"
  },
  {
    id: 'local-4',
    name: "Smart Watch with Heart Rate Monitor and Sleep Tracker, Waterproof",
    description: "Fitness tracking, heart rate monitoring, and smartphone notifications in a sleek design.",
    price: 5500,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    rating: 4.3, reviewCount: 210, stock: 50
  },
  {
    id: 'local-5',
    name: "Ergonomic Mesh Office Chair with Lumbar Support and Headrest",
    description: "Full lumbar support, adjustable armrests, and breathable mesh for long work sessions.",
    price: 15000,
    category: "Home & Living",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
    rating: 4.7, reviewCount: 45, stock: 8
  },
  {
    id: 'local-6',
    name: "Clean Code: A Handbook of Agile Software Craftsmanship",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    price: 1299,
    category: "Books",
    images: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80"],
    rating: 4.9, reviewCount: 320, stock: 100, badge: "New"
  },
  {
    id: 'local-7',
    name: "Yoga Mat with Carrying Strap, Non-Slip Texture, 6mm Thick",
    description: "Durable and eco-friendly yoga mat for your daily workout and meditation.",
    price: 1499,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1601925228880-e7b7b7b7b7b7?w=800&q=80"],
    rating: 4.6, reviewCount: 420, stock: 60
  },
  {
    id: 'local-8',
    name: "Luxury Skincare Gift Set — Serum, Cream and Cleanser",
    description: "A premium 3-piece set for a complete morning and evening skincare routine.",
    price: 6500,
    category: "Beauty",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80"],
    rating: 4.7, reviewCount: 92, stock: 20, badge: "Limited Edition"
  },
  {
    id: 'local-9',
    name: "The Lean Startup by Eric Ries, Paperback Edition",
    description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    price: 899,
    category: "Books",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"],
    rating: 4.8, reviewCount: 540, stock: 80
  },
  {
    id: 'local-10',
    name: "Organic Arabica Coffee Beans, 1kg, Medium Roast",
    description: "Rich and smooth organic coffee beans sourced from the highlands of Ethiopia.",
    price: 1800,
    category: "Grocery",
    images: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"],
    rating: 4.9, reviewCount: 1100, stock: 45, badge: "Best Value"
  },
  {
    id: 'local-11',
    name: "Men's Slim Fit Chinos, Cotton Stretch, Navy Blue",
    description: "Comfortable and versatile chinos for a smart-casual look.",
    price: 1999,
    category: "Clothing",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"],
    rating: 4.4, reviewCount: 88, stock: 40
  },
  {
    id: 'local-12',
    name: "Digital SLR Camera with 24.2MP Sensor and Full HD Video",
    description: "Capture stunning photos and videos with this professional-grade DSLR camera.",
    price: 55000,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"],
    rating: 4.8, reviewCount: 67, stock: 5, badge: "Professional"
  },
  {
    id: 'local-13',
    name: "Adjustable Dumbbell Set, 20kg, For Home Gym",
    description: "Versatile weight set for strength training at home. Includes plates and bars.",
    price: 4999,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=800&q=80"],
    rating: 4.5, reviewCount: 230, stock: 15
  },
  {
    id: 'local-14',
    name: "Face Moisturizer with SPF 30, All Skin Types, 50ml",
    description: "Hydrating face cream with sun protection. Lightweight and non-greasy.",
    price: 1200,
    category: "Beauty",
    images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"],
    rating: 4.6, reviewCount: 310, stock: 55
  },
  {
    id: 'local-15',
    name: "Modern Desk Lamp with USB Charging Port, 3 Brightness Levels",
    description: "Eye-caring LED desk lamp with touch control and flexible neck.",
    price: 2499,
    category: "Home & Living",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"],
    rating: 4.3, reviewCount: 125, stock: 30
  },
  {
    id: 'local-16',
    name: "Women's Floral Summer Dress, Breathable Cotton Fabric",
    description: "Lightweight and stylish floral dress, perfect for summer outings and beach days.",
    price: 2499,
    category: "Clothing",
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"],
    rating: 4.5, reviewCount: 145, stock: 35
  },
  {
    id: 'local-17',
    name: "Premium Blender for Smoothies and Shakes, 1200W Motor",
    description: "High-performance blender with pulse function and multiple speed settings.",
    price: 8500,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80"],
    rating: 4.7, reviewCount: 156, stock: 18
  },
  {
    id: 'local-18',
    name: "Running Shoes for Men, Breathable Mesh, Ultra-Lightweight",
    description: "Designed for comfort and performance. Perfect for daily runs and gym sessions.",
    price: 2500,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
    rating: 4.5, reviewCount: 1200, stock: 45
  },
  {
    id: 'local-19',
    name: "Organic Whole Wheat Atta, 5kg Pack, Freshly Ground",
    description: "Rich in fiber and nutrients. Sourced from the finest wheat fields.",
    price: 350,
    category: "Grocery",
    images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80"],
    rating: 4.8, reviewCount: 2400, stock: 100, badge: "Best Seller"
  },
  {
    id: 'local-20',
    name: "Extra Virgin Olive Oil, 1L Bottle, Cold Pressed",
    description: "Premium quality olive oil, perfect for dressings and light cooking.",
    price: 1200,
    category: "Grocery",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"],
    rating: 4.7, reviewCount: 850, stock: 50
  },
  {
    id: 'local-21',
    name: "Premium California Almonds, 500g Pack, Raw and Crunchy",
    description: "Large, high-quality almonds. Great for snacking or baking.",
    price: 550,
    category: "Grocery",
    images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80"],
    rating: 4.9, reviewCount: 3200, stock: 80, badge: "New"
  },
  {
    id: 'local-22',
    name: "Green Tea with Honey and Lemon, 25 Tea Bags",
    description: "Refreshing and healthy green tea blend to boost your immunity.",
    price: 199,
    category: "Grocery",
    images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80"],
    rating: 4.5, reviewCount: 600, stock: 120
  },
  {
    id: 'local-23',
    name: "Luxury Velvet Accent Chair, Emerald Green",
    description: "Elegant and comfortable accent chair to elevate your living room decor.",
    price: 18500,
    category: "Home & Living",
    images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"],
    rating: 4.8, reviewCount: 89, stock: 12, badge: "Premium"
  },
  {
    id: 'local-24',
    name: "Handwoven Jute Area Rug, 5x8 ft",
    description: "Eco-friendly, durable, and stylish jute rug for a warm, earthy aesthetic.",
    price: 5499,
    category: "Home & Living",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"],
    rating: 4.6, reviewCount: 154, stock: 25
  },
  {
    id: 'local-25',
    name: "Ceramic Minimalist Vase Set of 3",
    description: "Modern matte ceramic vases, perfect for dried flowers or standalone decor.",
    price: 1899,
    category: "Home & Living",
    images: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80"],
    rating: 4.9, reviewCount: 312, stock: 40
  },
  {
    id: 'local-26',
    name: "Men's Classic Wool Blend Overcoat",
    description: "Sophisticated tailored overcoat for winter elegance and warmth.",
    price: 12000,
    category: "Clothing",
    images: ["https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80"],
    rating: 4.7, reviewCount: 220, stock: 15, badge: "Winter Collection"
  },
  {
    id: 'local-27',
    name: "Women's High-Waisted Wide Leg Trousers",
    description: "Chic, comfortable, and versatile trousers for office or casual wear.",
    price: 2899,
    category: "Clothing",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"],
    rating: 4.8, reviewCount: 175, stock: 30
  },
  {
    id: 'local-28',
    name: "Organic Fresh Strawberries, 500g Box",
    description: "Sweet, juicy, and freshly picked organic strawberries.",
    price: 450,
    category: "Grocery",
    images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80"],
    rating: 4.9, reviewCount: 520, stock: 50, badge: "Fresh"
  },
];


// ── Fetch all products (uses LOCAL_PRODUCTS as primary, reliable source) ──
export const getProductsRTDB = async () => {
  return LOCAL_PRODUCTS;
};

// ── Firestore: Fetch all products ──
export const getProducts = async (filters = {}) => {
  try {
    let q = collection(db, 'products');

    if (filters.category && filters.category !== 'All') {
      q = query(q, where('category', '==', filters.category));
    }

    const snapshot = await getDocs(q);
    const firestoreProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // If Firestore returns data, use it; otherwise fall back to local
    if (firestoreProducts.length > 0) {
      return firestoreProducts;
    }
    console.warn('Firestore returned no products — using local fallback.');
    return LOCAL_PRODUCTS;
  } catch (err) {
    console.error('Firestore read failed, using local fallback:', err.message);
    return LOCAL_PRODUCTS;
  }
};

// ── Firestore: Fetch one product by ID ──
export const getProductById = async (id) => {
  // Check local fallback first for instant load
  if (id.startsWith('local-')) {
    return LOCAL_PRODUCTS.find(p => p.id === id) || null;
  }
  try {
    const docRef = doc(db, 'products', id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  } catch (err) {
    console.error('getProductById failed:', err.message);
    return null;
  }
};

// ── Seed Firestore only (RTDB writes removed — blocked by security rules) ──
export const seedProductsData = async () => {
  try {
    const collectionRef = collection(db, 'products');
    const existingFirestore = await getDocs(collectionRef);

    // Only seed if Firestore has fewer products than our local list
    if (existingFirestore.size >= LOCAL_PRODUCTS.length) return;

    for (const product of LOCAL_PRODUCTS) {
      const q = query(collectionRef, where('name', '==', product.name));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const { id, ...productData } = product;
        await addDoc(collectionRef, {
          ...productData,
          createdAt: serverTimestamp()
        });
      }
    }
  } catch (err) {
    // Silently fail — app still works from LOCAL_PRODUCTS
  }
};
