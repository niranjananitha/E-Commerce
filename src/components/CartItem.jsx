import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 hover:border-primary/30 transition-colors shadow-sm"
    >
      <div className="w-24 h-24 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-2">
        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
      </div>

      <div className="flex-1 text-center sm:text-left min-w-0">
        <h3 className="font-bold text-freshtext mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-freshmuted text-xs mb-1">In Stock</p>
        <p className="text-primary font-bold text-lg">₹{item.price.toLocaleString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
          <button 
            onClick={() => updateQuantity(item.id, -1)}
            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-freshtext"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-bold text-freshtext text-sm">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, 1)}
            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-freshtext"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex flex-col items-end gap-0.5 min-w-[100px]">
          <span className="text-[10px] text-freshmuted uppercase tracking-widest font-bold">Subtotal</span>
          <span className="text-lg font-black text-freshtext">₹{(item.price * item.quantity).toLocaleString()}</span>
        </div>

        <button 
          onClick={() => removeFromCart(item.id)}
          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          title="Remove item"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
