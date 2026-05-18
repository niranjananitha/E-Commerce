import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../utils/jwt';
import { rtdb } from '../firebase/config';
import { ref, onValue, push, set, remove } from 'firebase/database';
import toast from 'react-hot-toast';
import { LogOut, Package, Plus, Trash2, XCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [imageURL, setImageURL] = useState('');

  const categories = ['Electronics', 'Clothing', 'Footwear', 'Accessories', 'Home & Kitchen', 'Other'];

  useEffect(() => {
    // Check JWT
    const token = localStorage.getItem('admin_token');
    if (!token || !verifyToken(token)) {
      navigate('/admin');
      return;
    }

    // Fetch Products in Realtime
    const productsRef = ref(rtdb, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const productsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Sort by newest first
        productsArray.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setProducts(productsArray);
        setActiveCount(productsArray.filter(p => p.isActive).length);
      } else {
        setProducts([]);
        setActiveCount(0);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productsRef = ref(rtdb, 'products');
      const newProductRef = push(productsRef);
      
      const newProduct = {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
        imageURL,
        createdAt: Date.now(),
        isActive: true
      };

      await set(newProductRef, newProduct);
      toast.success('Product added successfully');
      
      // Clear form
      setName('');
      setDescription('');
      setPrice('');
      setCategory('Electronics');
      setStock('');
      setImageURL('');
    } catch (error) {
      toast.error('Failed to add product: ' + error.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const productRef = ref(rtdb, `products/${productId}/isActive`);
      await set(productRef, false);
      toast.success('Product removed from storefront');
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        const productRef = ref(rtdb, `products/${productId}`);
        await remove(productRef);
        toast.success('Product permanently deleted');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Package className="text-emerald-400" />
          <h1 className="text-xl font-black tracking-tight">Admin Dashboard</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* SECTION 1 - STATS BAR */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
            <Package size={32} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Active Products</p>
            <p className="text-4xl font-black text-slate-900">{activeCount}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SECTION 2 - ADD PRODUCT */}
          <section className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit sticky top-24">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-primary" /> Add New Product
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock</label>
                  <input required type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input required type="url" value={imageURL} onChange={e => setImageURL(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors mt-4">
                Add Product
              </button>
            </form>
          </section>

          {/* SECTION 3 - PRODUCT LIST */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-slate-900 mb-6 px-2">Manage Products</h2>
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <p className="text-slate-400 font-bold">No products found. Add some!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className={`bg-white p-4 rounded-2xl shadow-sm border flex flex-col sm:flex-row gap-4 items-center transition-all ${product.isActive ? 'border-slate-100' : 'border-red-100 opacity-75'}`}>
                    <img src={product.imageURL} alt={product.name} className="w-20 h-20 rounded-xl object-cover bg-slate-50" />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-slate-900">{product.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-4 text-sm font-bold">
                        <span className="text-primary">₹{product.price}</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-600">Stock: {product.stock}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {product.isActive ? (
                        <button 
                          onClick={() => handleRemove(product.id)}
                          className="flex items-center justify-center gap-2 bg-orange-50 text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full"
                        >
                          <XCircle size={14} /> Remove
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-red-500 text-xs font-bold py-2 bg-red-50 rounded-xl w-full">
                           <XCircle size={14} /> Inactive
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
