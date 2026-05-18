import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { subscribeActiveProducts } from '../firebase/productService';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { Search, Filter, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(200000);

  const location = useLocation();
  const categories = [
    'All',
    'Electronics',
    'Clothing',
    'Footwear',
    'Accessories',
    'Home & Kitchen',
    'Home & Living',
    'Grocery',
    'Books',
    'Sports',
    'Beauty',
    'Other',
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    setSelectedCategory(category || 'All');
    
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeActiveProducts(
      data => {
        setProducts(data);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    result = result.filter(p => p.price <= priceRange);
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, priceRange]);

  return (
    <div className="bg-background min-h-screen">
      {/* Shop Header */}
      <div className="bg-white border-b border-slate-100 py-10 px-4">
        <div className="max-w-[1500px] mx-auto">
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-primary">Shop All</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black font-display text-slate-900 tracking-tight">Our <span className="text-primary italic">Collections</span></h1>
              <p className="text-freshmuted font-medium mt-2">Explore {filteredProducts.length} premium products selected for you.</p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-fresh pl-12 bg-slate-50 border-none shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-32 space-y-10">
              {/* Categories */}
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Filter size={14} className="text-primary" /> Categories
                </h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        if (cat === 'All') {
                          navigate('/shop');
                        } else {
                          navigate(`/shop?category=${encodeURIComponent(cat)}`);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        selectedCategory === cat 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                        : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                      {selectedCategory === cat && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="glass-card p-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Price Range</h3>
                <div className="space-y-6">
                  <input 
                    type="range" 
                    min="0" 
                    max="200000" 
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-primary h-1 bg-slate-100 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center">
                    <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 block uppercase">Min</span>
                      <span className="text-sm font-bold">₹0</span>
                    </div>
                    <div className="w-4 h-px bg-slate-200"></div>
                    <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-right">
                      <span className="text-[10px] font-black text-slate-400 block uppercase">Max</span>
                      <span className="text-sm font-bold">₹{priceRange.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Grid Header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <button className="p-2 rounded-xl bg-white shadow-sm text-primary border border-slate-100"><LayoutGrid size={20} /></button>
                 <button className="p-2 rounded-xl text-slate-400 hover:bg-white hover:shadow-sm transition-all"><List size={20} /></button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort:</span>
                <select className="bg-transparent text-sm font-bold outline-none cursor-pointer">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-32 glass-card">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                  <Search size={48} />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">No products found</h3>
                <p className="text-fresh-muted font-medium mb-10 max-w-xs mx-auto">We couldn't find anything matching your filters. Try adjusting them!</p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setPriceRange(200000); setSearchQuery(''); navigate('/shop'); }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
