import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, CreditCard, Lock, MapPin, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const shipping = cartTotal > 999 ? 0 : 99;
  const tax = cartTotal * 0.18;
  const total = cartTotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error("Please fill in all delivery details");
      return;
    }

    setLoading(true);
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        userId: user.uid,
        items: cartItems,
        total: total,
        address: formData,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        paymentId: 'pay_' + Math.random().toString(36).substr(2, 9)
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      await clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-freshtext pt-10 pb-20">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-8 border border-slate-200 shadow-sm">
              <h1 className="text-2xl font-bold mb-8">1. Delivery Address</h1>
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 p-3 rounded-lg outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 p-3 rounded-lg outline-none transition-all"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Address</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 p-3 rounded-lg outline-none transition-all resize-none"
                    placeholder="House No, Street, Landmark..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 p-3 rounded-lg outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 p-3 rounded-lg outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Pincode</label>
                    <input 
                      type="text" 
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 p-3 rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white p-8 border border-slate-200 shadow-sm">
              <h1 className="text-2xl font-bold mb-8">2. Payment Method</h1>
              <div className="bg-slate-50 border-2 border-primary p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-bold">Online Payment / Pay on Delivery</p>
                    <p className="text-xs text-freshmuted italic">Secure transaction encrypted with SSL</p>
                  </div>
                </div>
                <div className="w-6 h-6 border-4 border-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[350px]">
            <div className="bg-white p-6 shadow-sm border border-slate-200 sticky top-32">
              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary hover:bg-indigo-700 text-white py-3 rounded-lg border border-primary/20 shadow-sm font-bold transition-all mb-4 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place your order"}
              </button>
              <p className="text-[11px] text-center text-freshmuted mb-6">
                By placing your order, you agree to Luxe Store's privacy notice and conditions of use.
              </p>

              <div className="h-px bg-slate-200 mb-6"></div>
              
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-slate-100">
                <div className="flex justify-between">
                  <span className="text-freshmuted">Items:</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-freshmuted">Delivery:</span>
                  <span className={shipping === 0 ? "text-secondary font-medium" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-freshmuted">Tax (18%):</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-lg font-bold text-red-600">Order Total:</span>
                <span className="text-xl font-bold text-red-600">₹{total.toLocaleString()}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded border border-slate-200">
                <div className="flex items-center gap-3 text-xs text-freshmuted">
                  <Lock size={16} />
                  <p>Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
