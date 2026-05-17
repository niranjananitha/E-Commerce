import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cartItems, cartTotal, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 999 ? 0 : 99;
  const tax = cartTotal * 0.18;
  const total = cartTotal + shipping + tax;

  if (!user) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center pt-20">
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-freshmuted mb-8 leading-relaxed">
            Please sign in to see your items and enjoy a seamless shopping experience.
          </p>
          <button 
            onClick={() => navigate('/sign-in')}
            className="w-full bg-primary hover:bg-indigo-700 text-white py-3 rounded-lg border border-primary/20 shadow-sm font-bold transition-all active:scale-95"
          >
            Sign In to Your Account
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen text-freshtext pt-10 pb-20">
      <div className="max-w-[1500px] mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Items List */}
            <div className="flex-1 bg-white p-6 shadow-sm border border-slate-200">
              <div className="hidden lg:flex justify-end text-sm text-freshmuted border-b border-slate-200 pb-2 mb-4">Price</div>
              <AnimatePresence mode="popLayout">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
              
              <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-freshmuted hover:text-primary transition-colors pt-4">
                <ArrowRight size={16} className="rotate-180" /> Continue Shopping
              </Link>
            </div>

            {/* Summary Sidebar */}
            <aside className="lg:w-[320px]">
              <div className="bg-white p-6 shadow-sm border border-slate-200 sticky top-32">
                <div className="flex items-center gap-2 mb-2 text-secondary text-sm font-medium">
                  <ShieldCheck size={18} />
                  <span>Your order qualifies for FREE Shipping</span>
                </div>
                <p className="text-[12px] text-freshmuted mb-6 leading-snug">
                  Choose this option at checkout. See details
                </p>

                <div className="text-xl mb-6 flex flex-wrap gap-1">
                  Subtotal ({cartItems.length} items): <span className="font-bold">₹{cartTotal.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary hover:bg-indigo-700 text-white py-2.5 rounded-lg border border-primary/20 shadow-sm font-medium text-sm transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-16 h-16 bg-slate-50 p-2 flex items-center justify-center border border-slate-100 rounded flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200" alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-primary group-hover:text-accent group-hover:underline line-clamp-2">Luxe Pro Sneakers - Premium Edition</p>
                      <p className="text-red-600 font-bold text-sm">₹2,499</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="bg-white p-12 text-center shadow-sm border border-slate-200 rounded-sm">
            <h2 className="text-3xl font-bold mb-4">Your Luxe Cart is empty</h2>
            <p className="text-freshmuted mb-10 max-w-sm mx-auto">
              Check your Saved Items or <Link to="/shop" className="text-primary hover:text-accent hover:underline">continue shopping</Link> for the latest trends.
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-primary hover:bg-indigo-700 text-white px-12 py-2.5 rounded-lg border border-primary/20 shadow-sm font-bold transition-all"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
