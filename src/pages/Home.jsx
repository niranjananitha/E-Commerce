import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscribeActiveProducts } from '../firebase/productService';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Shirt, 
  Home as HomeIcon, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  ShoppingBag,
  Gift
} from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeActiveProducts(
      data => {
        setProducts(data.slice(0, 10));
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  const categories = [
    {
      name: 'Electronics',
      link: 'Electronics',
      icon: <Cpu className="text-blue-500" />,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
      color: 'bg-blue-50',
    },
    {
      name: 'Grocery',
      link: 'Grocery',
      icon: <ShoppingBag className="text-emerald-500" />,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
      color: 'bg-emerald-50',
    },
    {
      name: 'Clothing',
      link: 'Clothing',
      icon: <Shirt className="text-rose-500" />,
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
      color: 'bg-rose-50',
    },
    {
      name: 'Home & Living',
      link: 'Home%20%26%20Living',
      icon: <HomeIcon className="text-amber-500" />,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
      color: 'bg-amber-50',
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Fresh Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-background"></div>
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} /> Summer Sale is Live
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black font-display text-slate-900 leading-[1.1] mb-6 tracking-tighter"
          >
            Elegance in every <span className="text-primary italic">click.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-freshmuted font-medium mb-10 max-w-2xl mx-auto"
          >
            Discover a curated collection of premium products designed to elevate your lifestyle. Fresh styles, unbeatable quality.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/shop" className="btn-primary py-4 px-10 rounded-2xl text-lg shadow-2xl shadow-primary/40">
              Shop Collection <ArrowRight size={20} />
            </Link>
            <Link to="/shop" className="btn-outline py-4 px-10 rounded-2xl text-lg bg-white/50 backdrop-blur-md">
              View Deals
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto px-4 relative -mt-16 z-10">
        {/* Modern Category Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card group cursor-pointer overflow-hidden flex flex-col h-[400px] hover:scale-[1.02] transition-all duration-500"
            >
              <div className="p-6 pb-0 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">{cat.name}</h3>
                  <p className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight size={14} />
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center`}>
                  {cat.icon}
                </div>
              </div>
              <div className="flex-1 overflow-hidden p-6">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </motion.div>
          ))}
        </section>

        {/* Trending Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-2">
                <TrendingUp size={14} /> Best of Luxe
              </div>
              <h2 className="text-4xl font-black font-display text-slate-900 tracking-tight">Trending <span className="text-primary italic">Now</span></h2>
            </div>
            <Link to="/shop" className="btn-outline py-2 px-6 rounded-xl text-sm font-bold">
              Explore All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {loading ? (
              [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              products.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Fresh Promo Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <Zap className="text-accent mb-6" size={40} />
              <h3 className="text-4xl font-black mb-4 tracking-tight">Flash Sale<br/>Under ₹999</h3>
              <p className="text-slate-400 mb-8 max-w-xs font-medium">Grab your favorites before they're gone. Limited time offers on top brands.</p>
              <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold hover:bg-accent hover:text-white transition-all active:scale-95">
                Shop Flash Sale
              </button>
            </div>
            <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-primary opacity-20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <Gift className="text-emerald-400 mb-6" size={40} />
              <h3 className="text-4xl font-black mb-4 tracking-tight">Refer & Earn<br/>₹500 Credits</h3>
              <p className="text-indigo-200 mb-8 max-w-xs font-medium">Invite your friends to Luxe Store and get credits on every successful purchase.</p>
              <button className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                Invite Friends
              </button>
            </div>
            <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <ShoppingBag size={200} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
