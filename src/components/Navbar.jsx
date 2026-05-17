import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Heart,
  ChevronDown,
  ArrowRight,
  Bell,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Electronics', path: '/shop?category=Electronics' },
    { name: 'Clothing', path: '/shop?category=Clothing' },
    { name: 'Home & Living', path: '/shop?category=Home%20%26%20Living' },
    { name: 'Grocery', path: '/shop?category=Grocery' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-white'}`}>
      {/* Top Strip */}
      <div className="bg-slate-900 text-white py-1 px-4 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center overflow-hidden">
        <div className="flex gap-4 items-center animate-pulse">
          <span>Free shipping on orders over ₹999</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <span className="hidden sm:inline">New Summer Collection live now</span>
        </div>
        <div className="flex gap-4">
          <Link to="/shop" className="hover:text-primary transition-colors">Track Order</Link>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
            <ShoppingBag size={24} />
          </div>
          <span className="text-2xl font-black font-display tracking-tighter text-slate-900">
            LUXE<span className="text-primary">STORE</span>
          </span>
        </Link>

        {/* Search Bar - Fresh Style */}
        <div className="hidden lg:flex flex-1 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search for premium products..." 
            className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition-colors">
              SEARCH
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* User Account */}
          <div className="relative" 
               onMouseEnter={() => setIsUserDropdownOpen(true)}
               onMouseLeave={() => setIsUserDropdownOpen(false)}>
            <button 
              onClick={() => navigate('/account')}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100 transition-all group"
            >
              {user && user.photoURL ? (
                <img src={user.photoURL} className="w-9 h-9 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all" alt="" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <User size={20} />
                </div>
              )}
              <div className="hidden xl:flex flex-col text-left leading-none">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Account</span>
                <span className="text-sm font-bold text-slate-900 truncate max-w-[100px]">
                  {user ? (user.displayName?.split(' ')[0] || 'Member') : 'Sign In'}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
            </button>

            <AnimatePresence>
              {isUserDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-64 glass-card p-4 z-[100] border border-slate-100"
                >
                  {!user ? (
                    <div className="text-center p-4">
                      <p className="text-sm font-bold mb-4">Start your premium journey</p>
                      <button onClick={() => navigate('/sign-in')} className="btn-primary w-full py-2 text-sm mb-3">Sign In</button>
                      <p className="text-[10px] text-freshmuted">New here? <Link to="/sign-in" className="text-primary hover:underline font-bold">Register Now</Link></p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="pb-3 mb-2 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="font-bold text-sm truncate">{user.email}</p>
                      </div>
                      <Link to="/account" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-sm font-bold">
                        <User size={18} className="text-primary" /> My Dashboard
                      </Link>
                      <Link to="/account" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-sm font-bold">
                        <ShoppingBag size={18} className="text-primary" /> My Orders
                      </Link>
                      <Link to="/account" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-sm font-bold">
                        <Heart size={18} className="text-primary" /> Watchlist
                      </Link>
                      <button onClick={logout} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-red-50 text-sm font-bold text-red-600">
                        <LogOut size={18} /> Sign Out
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-transparent group-hover:shadow-primary/20">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ring-2 ring-red-500/20 animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Categories Sub-Nav */}
      <div className="border-t border-slate-100 px-4">
        <div className="max-w-[1500px] mx-auto flex items-center gap-8 py-3 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/shop" className="flex items-center gap-2 text-sm font-black text-slate-900 hover:text-primary transition-colors">
            <Menu size={18} /> EXPLORE ALL
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={cat.path} 
              className="text-xs font-bold text-slate-500 hover:text-primary transition-all relative group py-1"
            >
              {cat.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400">
              <MapPin size={12} /> DELIVER TO: <span className="text-slate-900">INDIA</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
