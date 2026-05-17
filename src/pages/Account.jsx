import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import {
  User,
  Package,
  Heart,
  Settings,
  ChevronRight,
  LogOut,
  MapPin,
  ShoppingBag,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  Mail,
  Shield,
  Bell,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2 font-display">Secure Access</h2>
          <p className="text-freshmuted mb-8 text-sm">Please sign in to view your personalized dashboard and order history.</p>
          <button 
            onClick={() => navigate('/sign-in')} 
            className="btn-primary w-full shadow-xl shadow-primary/20"
          >
            Sign In Now
          </button>
        </motion.div>
      </div>
    );
  }

  const sections = [
    { id: 'dashboard', icon: <User size={20} />, label: 'Profile Dashboard', description: 'Manage your profile and account settings' },
    { id: 'orders', icon: <Package size={20} />, label: 'My Orders', description: 'Track, return, or buy things again', count: orders.length },
    { id: 'watchlist', icon: <Heart size={20} />, label: 'Watchlist', description: 'Your saved items for later' },
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications', description: 'Stay updated on your orders' },
  ];

  return (
    <div className="bg-background min-h-screen pt-10 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Fresh Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-xs font-medium text-freshmuted mb-3 uppercase tracking-wider">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-primary">Account Dashboard</span>
            </nav>
            <h1 className="text-4xl font-black font-display text-slate-900 tracking-tight">
              Hello, <span className="text-primary">{user.displayName?.split(' ')[0] || 'Member'}!</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={logout} className="btn-outline border-red-100 text-red-600 hover:bg-red-50 py-2 px-4 text-sm">
               <LogOut size={16} /> Sign Out
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left ${
                  activeSection === section.id 
                    ? 'bg-white shadow-xl shadow-slate-200/50 border border-slate-100 translate-x-1' 
                    : 'hover:bg-slate-100 text-freshmuted'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeSection === section.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-white text-slate-400'
                }`}>
                  {section.icon}
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    {section.label}
                    {section.count > 0 && (
                      <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
                        {section.count}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] opacity-60 font-medium truncate max-w-[140px]">{section.description}</div>
                </div>
              </button>
            ))}
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeSection === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Profile Card */}
                  <div className="glass-card overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-primary to-indigo-400"></div>
                    <div className="px-8 pb-8">
                      <div className="relative -mt-12 flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
                        <div className="relative">
                          <img 
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff&size=128`} 
                            alt={user.displayName} 
                            className="w-32 h-32 rounded-3xl border-8 border-white shadow-2xl object-cover bg-white"
                          />
                          <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
                        </div>
                        <div className="flex-1 pb-2">
                          <h2 className="text-3xl font-black font-display text-slate-900">{user.displayName}</h2>
                          <p className="text-freshmuted font-medium flex items-center gap-2">
                            <Mail size={16} /> {user.email}
                          </p>
                        </div>
                        <button className="btn-outline text-xs px-4 py-2 self-start sm:self-center">
                          Edit Profile
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                          <p className="text-2xl font-black text-primary">{orders.length}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
                          <p className="text-2xl font-black text-primary">2024</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Saved Items</p>
                          <p className="text-2xl font-black text-primary">12</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MapPin className="text-primary" size={20} /> Shipping Addresses
                      </h3>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 mb-4">
                        <p className="text-xs font-black text-primary mb-1">Default Home</p>
                        <p className="text-sm font-medium">123 Fresh Avenue, Green Park</p>
                        <p className="text-sm text-freshmuted">Mumbai, MH 400001, India</p>
                      </div>
                      <button className="text-sm font-bold text-primary hover:underline">Add New Address +</button>
                    </div>
                    <div className="glass-card p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <CreditCard className="text-primary" size={20} /> Payment Methods
                      </h3>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 mb-4 flex items-center gap-4">
                        <div className="w-12 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold text-[8px]">VISA</div>
                        <div>
                          <p className="text-sm font-bold">•••• 4242</p>
                          <p className="text-xs text-freshmuted">Expires 12/26</p>
                        </div>
                      </div>
                      <button className="text-sm font-bold text-primary hover:underline">Manage Cards →</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black font-display text-slate-900">Your <span className="text-primary">Order History</span></h2>
                    <div className="text-xs font-bold text-freshmuted bg-slate-100 px-3 py-1.5 rounded-full uppercase">Total: {orders.length}</div>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 glass-card animate-pulse"></div>
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {orders.map((order) => (
                        <div key={order.id} className="glass-card overflow-hidden group">
                          <div className="bg-slate-50/50 p-6 flex flex-wrap justify-between items-center gap-4 border-b border-slate-100">
                            <div className="flex gap-6">
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Date</p>
                                <p className="text-sm font-bold">{order.createdAt?.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="text-sm font-bold text-primary">₹{order.total.toLocaleString()}</p>
                              </div>
                              <div className="hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                                <p className="text-sm font-mono font-medium text-slate-500">#{order.id.slice(-8).toUpperCase()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                               <CheckCircle2 size={14} className="text-secondary" />
                               <span className="text-xs font-black uppercase tracking-wider text-secondary">{order.status || 'Delivered'}</span>
                            </div>
                          </div>
                          <div className="p-6 flex items-center justify-between gap-6">
                            <div className="flex -space-x-4 overflow-hidden py-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="relative inline-block w-16 h-16 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden group-hover:translate-y-[-4px] transition-transform duration-300 flex-shrink-0" style={{ zIndex: 10 - idx }}>
                                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="relative inline-block w-16 h-16 rounded-2xl border-4 border-white bg-slate-100 shadow-lg flex items-center justify-center text-xs font-bold text-primary z-0">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                               <button className="btn-primary py-2 px-4 text-xs whitespace-nowrap">Track Order</button>
                               <button className="btn-outline py-2 px-4 text-xs whitespace-nowrap">Order Details</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 glass-card">
                      <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={48} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                      <p className="text-freshmuted mb-8 max-w-xs mx-auto">Your shopping bag is empty. Start exploring our latest collections.</p>
                      <Link to="/shop" className="btn-primary inline-flex">Start Shopping</Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeSection === 'watchlist' && (
                <motion.div
                  key="watchlist"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black font-display text-slate-900">Your <span className="text-primary">Watchlist</span></h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sample Watchlist Items */}
                    {[1, 2].map((i) => (
                      <div key={i} className="glass-card flex gap-4 p-4 items-center">
                         <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                           <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80&idx=${i}`} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">Premium Smart Gadget {i}</h4>
                            <p className="text-primary font-black mb-2">₹4,999</p>
                            <div className="flex gap-2">
                               <button className="text-[10px] font-black uppercase text-primary hover:underline">Add to Cart</button>
                               <button className="text-[10px] font-black uppercase text-red-500 hover:underline">Remove</button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center py-12">
                     <p className="text-sm text-freshmuted italic">Found something you like? Add it to your cart or keep browsing.</p>
                  </div>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black font-display text-slate-900">Recent <span className="text-primary">Notifications</span></h2>
                  <div className="glass-card divide-y divide-slate-100">
                    <div className="p-6 flex gap-4 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Your order #UX90210 has been shipped!</p>
                        <p className="text-xs text-freshmuted mt-1">Expected delivery by Friday, 16th May. Track your package for live updates.</p>
                        <p className="text-[10px] text-primary font-bold mt-2 uppercase tracking-widest">2 hours ago</p>
                      </div>
                    </div>
                    <div className="p-6 flex gap-4 hover:bg-slate-50 transition-colors opacity-60">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Bell size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Summer Collection is here!</p>
                        <p className="text-xs text-freshmuted mt-1">Explore our new range of breathable summer wear and light home decor.</p>
                        <p className="text-[10px] text-primary font-bold mt-2 uppercase tracking-widest">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
