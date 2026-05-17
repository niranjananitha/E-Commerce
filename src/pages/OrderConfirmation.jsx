import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  const { id } = useParams();

  return (
    <div className="bg-background min-h-screen text-freshtext pt-32 pb-20 flex items-center justify-center">
      <div className="max-w-xl w-full px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg"
        >
          <CheckCircle size={48} className="text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold font-display mb-4">Order Confirmed!</h1>
          <p className="text-freshmuted mb-12 text-lg">
            Thank you for your purchase. Your order <span className="text-freshtext font-bold">#{id}</span> has been placed successfully.
          </p>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-12 flex flex-col md:flex-row gap-8 items-center text-left shadow-sm">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary flex-shrink-0">
              <Package size={32} />
            </div>
            <div>
              <h4 className="font-bold mb-1">Estimated Delivery</h4>
              <p className="text-sm text-freshmuted">Your package will arrive within <span className="text-secondary font-bold">3-5 business days</span>. We'll send you an update as soon as it's on its way.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/account" 
              className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Track Order <ArrowRight size={18} />
            </Link>
            <Link 
              to="/" 
              className="bg-white text-freshtext border border-slate-300 px-10 py-4 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Home size={18} /> Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
