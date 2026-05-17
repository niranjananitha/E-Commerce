import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft, Shield, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const SignIn = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/account');
    } catch (error) {
      // Error handled in AuthContext
    }
  };

  const handleManualSignIn = (e) => {
    e.preventDefault();
    toast.error('Direct email sign-in is coming soon. Please use Google for now!', {
      icon: '🛡️',
      style: { borderRadius: '15px' }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Back Button */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
        <ChevronLeft size={16} /> Back to Store
      </Link>

      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-primary/30">
            <ShoppingBag size={32} />
          </div>
          <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight mb-2">Welcome to <span className="text-primary">Luxe Store</span></h1>
          <p className="text-freshmuted font-medium">Join our community of premium enthusiasts.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 bg-white shadow-2xl shadow-slate-200/50"
        >
          <form onSubmit={handleManualSignIn} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} className="text-primary" /> Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-fresh"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Lock size={12} className="text-primary" /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-fresh"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 rounded-2xl shadow-xl shadow-primary/20"
            >
              Continue to Luxe
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-white px-4 text-slate-300">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-4 bg-white border border-slate-200 py-4 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all font-bold text-sm text-slate-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="flex items-center gap-2 justify-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
             <Shield size={14} className="text-secondary" /> 100% Secure Transaction
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-primary uppercase tracking-widest">
            <Link to="/" className="hover:underline">Conditions</Link>
            <Link to="/" className="hover:underline">Privacy</Link>
            <Link to="/" className="hover:underline">Help</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
