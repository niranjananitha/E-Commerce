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

const snapshotToProducts = (snapshot, activeOnly = true) => {
  if (!snapshot.exists()) return [];

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

export const seedProductsData = async () => {
  console.warn('Product seeding is disabled. Products are managed from the admin dashboard in Realtime Database.');
};
