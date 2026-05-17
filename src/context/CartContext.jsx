import React, { createContext, useContext, useEffect, useState } from 'react';
import { rtdb } from '../firebase/config';
import { useAuth } from './AuthContext';
import { ref, onValue, set, remove, update } from 'firebase/database';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    // Real-time listener for user's cart in RTDB
    const cartRef = ref(rtdb, `carts/${user.uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Cart listener error:", error);
      toast.error("Failed to sync cart");
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    const itemRef = ref(rtdb, `carts/${user.uid}/${product.id}`);
    
    try {
      // Check if item already exists to increment quantity
      const existingItem = cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        await update(itemRef, {
          quantity: existingItem.quantity + quantity
        });
      } else {
        await set(itemRef, {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: quantity,
          addedAt: Date.now()
        });
      }
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (productId, delta) => {
    if (!user) return;
    const itemRef = ref(rtdb, `carts/${user.uid}/${productId}`);
    const item = cartItems.find(i => i.id === productId);
    
    if (item.quantity + delta <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      await update(itemRef, {
        quantity: item.quantity + delta
      });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    const itemRef = ref(rtdb, `carts/${user.uid}/${productId}`);
    try {
      await remove(itemRef);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    const cartRef = ref(rtdb, `carts/${user.uid}`);
    try {
      await remove(cartRef);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
