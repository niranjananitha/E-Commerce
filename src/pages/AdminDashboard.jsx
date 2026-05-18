import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Edit,
  ImageIcon,
  IndianRupee,
  LogOut,
  Package,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  addProduct,
  permanentlyDeleteProduct,
  removeProductFromStorefront,
  subscribeAllProducts,
  updateProduct,
} from '../firebase/productService';
import { verifyToken } from '../utils/jwt';

const categories = [
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
  'Other'
];

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: 'Electronics',
  stock: '',
  imageURL: '',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token || !verifyToken(token)) {
      navigate('/admin');
      return undefined;
    }

    const unsubscribe = subscribeAllProducts((productsArray) => {
      const activeProducts = productsArray.filter(product => product.isActive);
      setProducts(activeProducts);
      setActiveCount(activeProducts.length);
    });

    return () => unsubscribe();
  }, [navigate]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setFormError('');

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, form);
        const message = 'Product updated successfully';
        setSuccessMessage(message);
        setForm(initialForm);
        setEditingProductId(null);
        toast.success(message);
      } else {
        await addProduct(form);
        const message = 'Product added successfully';
        setSuccessMessage(message);
        setForm(initialForm);
        toast.success(message);
      }
    } catch (error) {
      const isPermissionDenied = error.message?.includes('PERMISSION_DENIED');
      const message = isPermissionDenied
        ? 'Firebase denied this write. Deploy database.rules.json to allow writes to /products.'
        : `Failed to ${editingProductId ? 'update' : 'add'} product: ` + error.message;

      setFormError(message);
      toast.error(message);
    }
  };

  const handleStartEdit = (product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageURL: product.imageURL,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setForm(initialForm);
    setSuccessMessage('');
    setFormError('');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;

    try {
      await permanentlyDeleteProduct(productId);
      toast.success('Product permanently deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b border-white/70 bg-white/85 px-4 py-4 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Package size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Luxe Store</p>
              <h1 className="text-lg font-black tracking-tight text-slate-900">Admin Dashboard</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-outline px-4 py-2 text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <section className="relative overflow-hidden px-4 py-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000&q=80"
            alt=""
            className="h-full w-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-background/90 to-background"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1500px]">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary">
                <Package size={14} /> Product Control
              </div>
              <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                Real-time catalog management.
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-freshmuted">
                Products added here publish instantly to the storefront, and removed products disappear without a page refresh.
              </p>
            </div>

            <div className="glass-card flex min-w-[260px] items-center gap-5 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <Package size={32} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Active Products</p>
                <p className="text-4xl font-black text-slate-900">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[430px_1fr]">
            <section className="glass-card h-fit p-6 lg:sticky lg:top-28">
              <h3 className="mb-1 flex items-center gap-2 text-xl font-black text-slate-900">
                {editingProductId ? (
                  <>
                    <Edit size={20} className="text-primary" /> Edit Product
                  </>
                ) : (
                  <>
                    <Plus size={20} className="text-primary" /> Add Product
                  </>
                )}
              </h3>
              <p className="mb-6 text-sm font-medium text-freshmuted">
                {editingProductId 
                  ? 'Update the product details in Realtime Database.' 
                  : 'Create a Realtime Database product under /products.'}
              </p>

              {formError && (
                <div className="mb-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
                  <AlertTriangle className="mt-0.5 flex-shrink-0" size={18} />
                  <p className="text-sm font-bold leading-5">{formError}</p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Product Name</label>
                  <input required type="text" value={form.name} onChange={e => updateField('name', e.target.value)} className="input-fresh bg-slate-50" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                  <textarea required value={form.description} onChange={e => updateField('description', e.target.value)} className="input-fresh h-28 resize-none bg-slate-50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Price (Rs.)</label>
                    <input required type="number" min="0" value={form.price} onChange={e => updateField('price', e.target.value)} className="input-fresh bg-slate-50" />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Stock</label>
                    <input required type="number" min="0" value={form.stock} onChange={e => updateField('stock', e.target.value)} className="input-fresh bg-slate-50" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                  <select value={form.category} onChange={e => updateField('category', e.target.value)} className="input-fresh bg-slate-50">
                    {categories.map(category => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Image URL</label>
                  <input required type="url" value={form.imageURL} onChange={e => updateField('imageURL', e.target.value)} className="input-fresh bg-slate-50" />
                </div>
                {successMessage && (
                  <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                    {successMessage}
                  </p>
                )}
                <div className="flex gap-3">
                  {editingProductId && (
                    <button 
                      type="button" 
                      onClick={handleCancelEdit} 
                      className="btn-outline w-1/2 py-3 border-slate-200 text-slate-500 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className={`btn-primary py-3 flex items-center justify-center gap-2 ${editingProductId ? 'w-1/2' : 'w-full'}`}>
                    {editingProductId ? 'Update' : 'Add Product'} <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </section>

            <section>
              <div className="mb-6 flex flex-col gap-2 px-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">Currently Listed Products</p>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Live Storefront Inventory</h3>
                </div>
                <p className="text-sm font-bold text-freshmuted">{products.length} active item{products.length === 1 ? '' : 's'}</p>
              </div>

              {products.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                    <Package size={38} />
                  </div>
                  <p className="text-lg font-black text-slate-900">No active products yet</p>
                  <p className="mt-2 text-sm font-medium text-freshmuted">Add your first product to publish it to the storefront.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {products.map((product) => (
                    <div key={product.id} className="group overflow-hidden rounded-[2rem] border border-white bg-white/90 shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-2xl">
                      <div className="flex gap-4 p-4">
                        <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-50">
                          {product.imageURL ? (
                            <img src={product.imageURL} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <ImageIcon className="text-slate-300" size={34} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-primary">{product.category}</p>
                          <h4 className="line-clamp-2 font-black leading-tight text-slate-900">{product.name}</h4>
                          <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1.5"><IndianRupee size={13} /> {product.price.toLocaleString()}</span>
                            <span>Stock: {product.stock}</span>
                            <span className="col-span-2 flex items-center gap-1.5">
                              <Calendar size={13} /> {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'No date'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4">
                        <button
                          onClick={() => handleStartEdit(product)}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-50 px-4 py-3 text-xs font-black text-primary transition-colors hover:bg-indigo-100"
                        >
                          <Edit size={15} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
