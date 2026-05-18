import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { subscribeProductById } from '../firebase/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Minus,
  Plus,
  Share2,
  Heart,
  Lock,
  ChevronRight,
  ShoppingBag,
  Zap,
  Info
} from 'lucide-react';
import LiveVisitors from '../components/LiveVisitors';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeProductById(
      id,
      data => {
        if (!data) {
          toast.error("Product not found");
          navigate('/shop');
          return;
        }

        setProduct(data);
        setLoading(false);
      },
      () => {
        toast.error("Product not found");
        navigate('/shop');
      }
    );

    window.scrollTo(0, 0);

    return () => unsubscribe();
  }, [id, navigate]);

  if (loading) return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-[1500px] mx-auto px-4 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-primary">{product.category}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Gallery */}
          <div className="lg:w-1/2">
            <div className="sticky top-32 space-y-6">
              <motion.div 
                layoutId={`img-${product.id}`}
                className="aspect-square glass-card overflow-hidden flex items-center justify-center p-12 bg-white"
              >
                <img
                  key={activeImage}
                  src={imgError ? `https://placehold.co/600x600?text=${encodeURIComponent(product.category || 'Product')}` : product.images?.[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-700"
                  onError={() => setImgError(true)}
                  onLoad={() => setImgError(false)}
                />
              </motion.div>
              
              {product.images?.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setActiveImage(idx); setImgError(false); }}
                      className={`w-20 h-20 rounded-2xl overflow-hidden transition-all p-2 bg-white border-2 ${
                        activeImage === idx ? 'border-primary shadow-lg scale-105' : 'border-slate-100 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain mix-blend-multiply"
                        onError={e => { e.target.src = 'https://placehold.co/64x64?text=📦'; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {product.category}
                </span>
                <button className="p-3 bg-white shadow-sm border border-slate-100 rounded-2xl text-slate-300 hover:text-red-500 transition-all">
                  <Heart size={20} />
                </button>
              </div>
              <h1 className="text-4xl font-black font-display text-slate-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-6">
                 <LiveVisitors productId={product.id} />
                 <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                       <Star size={18} fill="currentColor" />
                    </div>
                    <span className="font-black text-slate-900">{product.rating}</span>
                    <span className="text-sm font-bold text-slate-400">({product.reviewCount} Reviews)</span>
                 </div>
              </div>
            </div>

            <div className="glass-card p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                    <span className="text-lg font-bold text-slate-300 line-through">₹{(product.price * 1.2).toLocaleString()}</span>
                  </div>
                  <p className="text-xs font-bold text-secondary flex items-center gap-1">
                     <Zap size={12} fill="currentColor" /> SAVE ₹{(product.price * 0.2).toLocaleString()} TODAY
                  </p>
               </div>
               
               <div className="flex flex-col gap-3 w-full sm:w-auto min-w-[200px]">
                  <div className="flex items-center justify-between bg-slate-100 rounded-2xl p-1">
                     <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-600 active:scale-95 transition-all"><Minus size={16} /></button>
                     <span className="font-black text-slate-900">{quantity}</span>
                     <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-600 active:scale-95 transition-all"><Plus size={16} /></button>
                  </div>
                  <button 
                    onClick={() => { addToCart(product, quantity); toast.success('Added to bag!'); }}
                    className="btn-primary py-4 rounded-2xl shadow-2xl shadow-primary/30"
                  >
                    <ShoppingBag size={20} /> Add to Bag
                  </button>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">
                  <Info size={16} className="text-primary" /> Product Details
               </div>
               <p className="text-freshmuted font-medium leading-relaxed">
                  {product.description}
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { icon: <Truck size={24} />, label: "Express Shipping", sub: "2-3 Days Delivery" },
                    { icon: <ShieldCheck size={24} />, label: "Quality Insured", sub: "100% Authentic" },
                    { icon: <RotateCcw size={24} />, label: "Easy Returns", sub: "30 Day Window" }
                  ].map((item, i) => (
                    <div key={i} className="glass-card p-6 text-center space-y-2">
                      <div className="text-primary flex justify-center">{item.icon}</div>
                      <p className="text-sm font-black text-slate-900">{item.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{item.sub}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
