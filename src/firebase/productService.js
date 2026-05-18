import { ref, onValue, push, set, remove, get } from 'firebase/database';
import { rtdb } from './config';

const productsPath = 'products';

const normalizeProduct = (id, product = {}) => {
  const imageURL = product.imageURL || product.images?.[0] || '';

  return {
    ...product,
    id,
    name: product.name || '',
    description: product.description || '',
    price: Number(product.price) || 0,
    category: product.category || 'Other',
    stock: Number(product.stock) || 0,
    imageURL,
    images: product.images?.length ? product.images : [imageURL].filter(Boolean),
    rating: product.rating || 4.5,
    reviewCount: product.reviewCount || 0,
    createdAt: Number(product.createdAt) || 0,
    isActive: product.isActive === true,
  };
};

const defaultProducts = [
  {
    name: "iPhone 15 Pro Max",
    description: "Experience the ultimate iPhone. Titanium design, groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.",
    price: 159900,
    category: "Electronics",
    stock: 25,
    imageURL: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    badge: "Hot",
    rating: 4.9,
    reviewCount: 124,
    isActive: true
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancellation headphones with premium sound, crystal-clear hands-free calling, and up to 30 hours of battery life.",
    price: 29990,
    category: "Electronics",
    stock: 40,
    imageURL: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80",
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 312,
    isActive: true
  },
  {
    name: "Premium Silk Button-Up Shirt",
    description: "Crafted from 100% pure mulberry silk. A sophisticated drape, ultra-smooth texture, and a timeless silhouette designed for effortless elegance.",
    price: 7999,
    category: "Clothing",
    stock: 15,
    imageURL: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    badge: "New",
    rating: 4.6,
    reviewCount: 45,
    isActive: true
  },
  {
    name: "Handcrafted Italian Leather Boots",
    description: "Meticulously crafted in Italy from full-grain calfskin leather. Durable Goodyear welt construction, rich hand-burnished finish, and exceptional comfort.",
    price: 18999,
    category: "Footwear",
    stock: 12,
    imageURL: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80",
    badge: "Trending",
    rating: 4.7,
    reviewCount: 88,
    isActive: true
  },
  {
    name: "Minimalist Gold-Plated Watch",
    description: "A stunning timepiece featuring a 38mm brushed gold-plated stainless steel case, clean indices, premium Japanese quartz movement, and a genuine leather strap.",
    price: 14999,
    category: "Accessories",
    stock: 18,
    imageURL: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    badge: "Luxe",
    rating: 4.5,
    reviewCount: 56,
    isActive: true
  },
  {
    name: "Premium Handwoven Cashmere Throw",
    description: "Wrap yourself in pure luxury. Handwoven in the Himalayas from exceptionally soft, high-grade cashmere. Adds sophisticated warmth to any living space.",
    price: 12499,
    category: "Home & Living",
    stock: 8,
    imageURL: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&q=80",
    badge: "Exclusive",
    rating: 4.9,
    reviewCount: 29,
    isActive: true
  },
  {
    name: "Artisanal Single-Origin Coffee Gift Set",
    description: "A curated selection of three rare, single-origin whole bean coffees sourced sustainably from Ethiopia, Colombia, and Sumatra. Freshly roasted.",
    price: 2499,
    category: "Grocery",
    stock: 50,
    imageURL: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    badge: "Gourmet",
    rating: 4.8,
    reviewCount: 142,
    isActive: true
  }
];

let isSeeding = false;

export const seedProductsData = async () => {
  if (isSeeding) return;
  isSeeding = true;
  console.log('Seeding default products into Realtime Database...');
  try {
    const productsRef = ref(rtdb, productsPath);
    for (const product of defaultProducts) {
      const newRef = push(productsRef);
      await set(newRef, {
        ...product,
        createdAt: Date.now()
      });
    }
    console.log('Successfully seeded default products!');
  } catch (error) {
    console.error('Failed to seed products:', error);
  } finally {
    isSeeding = false;
  }
};

const snapshotToProducts = (snapshot, activeOnly = true) => {
  if (!snapshot.exists()) {
    seedProductsData().catch(console.error);
    return [];
  }

  return Object.entries(snapshot.val())
    .map(([id, product]) => normalizeProduct(id, product))
    .filter(product => !activeOnly || product.isActive)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const subscribeActiveProducts = (callback, onError) => {
  const productsRef = ref(rtdb, productsPath);

  return onValue(
    productsRef,
    snapshot => callback(snapshotToProducts(snapshot, true)),
    error => {
      console.error('Products listener failed:', error.message);
      if (onError) onError(error);
    }
  );
};

export const subscribeAllProducts = (callback, onError) => {
  const productsRef = ref(rtdb, productsPath);

  return onValue(
    productsRef,
    snapshot => callback(snapshotToProducts(snapshot, false)),
    error => {
      console.error('Admin products listener failed:', error.message);
      if (onError) onError(error);
    }
  );
};

export const subscribeProductById = (id, callback, onError) => {
  const productRef = ref(rtdb, `${productsPath}/${id}`);

  return onValue(
    productRef,
    snapshot => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      const product = normalizeProduct(snapshot.key, snapshot.val());
      callback(product.isActive ? product : null);
    },
    error => {
      console.error('Product listener failed:', error.message);
      if (onError) onError(error);
    }
  );
};

export const addProduct = async (product) => {
  const productsRef = ref(rtdb, productsPath);
  const newProductRef = push(productsRef);

  await set(newProductRef, {
    name: product.name.trim(),
    description: product.description.trim(),
    price: Number(product.price),
    category: product.category,
    stock: Number(product.stock),
    imageURL: product.imageURL.trim(),
    createdAt: Date.now(),
    isActive: true,
  });

  return newProductRef.key;
};

export const removeProductFromStorefront = (productId) =>
  set(ref(rtdb, `${productsPath}/${productId}/isActive`), false);

export const permanentlyDeleteProduct = (productId) =>
  remove(ref(rtdb, `${productsPath}/${productId}`));

export const getProductsRTDB = async (activeOnly = true) => {
  const snapshot = await get(ref(rtdb, productsPath));
  return snapshotToProducts(snapshot, activeOnly);
};

export const getProducts = getProductsRTDB;

export const getProductById = async (id) => {
  const snapshot = await get(ref(rtdb, `${productsPath}/${id}`));
  if (!snapshot.exists()) return null;

  const product = normalizeProduct(snapshot.key, snapshot.val());
  return product.isActive ? product : null;
};
