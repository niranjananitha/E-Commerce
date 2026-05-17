import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ImageOff, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Stable fallback images per category
const CATEGORY_FALLBACKS = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=75',
  Clothing:    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=75',
  Grocery:     'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=75',
  'Home & Living': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75',
  Books:       'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=75',
  Sports:      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=75',
  Beauty:      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=75',
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.name.slice(0, 15)}...`, { 
      icon: '🛍️',
      style: { borderRadius: '15px', background: '#333', color: '#fff', fontSize: '12px' } 
    });
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? 'Removed from watchlist' : 'Added to watchlist', {
      icon: isWishlisted ? '💔' : '❤️',
      style: { borderRadius: '15px', fontSize: '12px' }
    });
  };

  const imgSrc = imgError
    ? (CATEGORY_FALLBACKS[product.category] || 'https://placehold.co/300x300?text=Product')
    : (product.images?.[0] || CATEGORY_FALLBACKS[product.category] || 'https://placehold.co/300x300?text=Product');

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden h-full flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 flex items-center justify-center p-6">
          {/* Skeleton shimmer while loading */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-slate-100 animate-pulse" />
          )}

          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgLoaded(true); setImgError(true); }}
            className={`max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-all duration-700 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {product.badge && (
            <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest z-10 shadow-lg shadow-primary/20">
              {product.badge}
            </span>
          )}
          
          <button
            onClick={toggleWishlist}
            className={`absolute top-4 right-4 p-2.5 rounded-2xl shadow-xl transition-all z-10 ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-slate-300 hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick Action Overlay */}
          <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary py-3 rounded-2xl text-xs font-black uppercase tracking-wider"
            >
              <ShoppingBag size={14} /> Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 opacity-60">{product.category}</p>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-amber-400">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-black ml-1 text-slate-900">{product.rating || '4.5'}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              ({(product.reviewCount || 0).toLocaleString()} reviews)
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 line-through">₹{Math.round((product.price || 0) * 1.2).toLocaleString()}</span>
              <span className="text-xl font-black text-slate-900 leading-none">₹{(product.price || 0).toLocaleString()}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
               <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
