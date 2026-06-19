import { useEffect, useState } from "react";
import { Package, Plus, Pencil, Trash2, X, Tag, DollarSign, Archive, Store } from "lucide-react";
import { motion } from "framer-motion";

const API = "http://localhost:5000/api/admin/marketplace";
const token = () => localStorage.getItem("token");
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

export default function AdminMarketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({ total: 0, active: 0, pendingOrders: 84, revenue: 12402 });

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("other");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("active");

  const categories = ['clothing', 'accessories', 'books', 'stationery', 'other'];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const url = new URL(API);
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", "20");
      if (statusFilter !== "all") url.searchParams.append("status", statusFilter);
      if (categoryFilter !== "all") url.searchParams.append("category", categoryFilter);

      const res = await fetch(url.toString(), { headers: headers() });
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      
      // Update basic stats based on full unpaginated counts if available, otherwise just use what we have
      const activeCount = (data.products || []).filter((p: any) => p.status === 'active').length;
      setStats(prev => ({ ...prev, total: data.total || 0, active: activeCount }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, [page, statusFilter, categoryFilter]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("other");
    setImageUrl("");
    setStatus("active");
    setEditingProduct(null);
  };

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price);
      setStock(product.stock);
      setCategory(product.category);
      setImageUrl(product.image_url || "");
      setStatus(product.status);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `${API}/${editingProduct.id}` : API;
      
      const payload = { 
        name, 
        description, 
        price: parseFloat(price), 
        stock: parseInt(stock), 
        category, 
        image_url: imageUrl || `https://picsum.photos/seed/${name.replace(/\\s/g, '')}/200/200`,
        status 
      };
      
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setModalOpen(false);
        loadProducts();
      } else {
        alert("Failed to save product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE", headers: headers() });
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Marketplace Management</h1>
          <p className="text-sm text-foreground/60">Manage inventory, pricing, and fulfillment.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-secondary/90 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-foreground/50">
            <Package className="w-5 h-5 text-secondary" />
            <span className="text-xs font-bold uppercase tracking-widest">Total Items</span>
          </div>
          <h3 className="text-2xl font-extrabold text-secondary">{stats.total}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-foreground/50">
            <Store className="w-5 h-5 text-success" />
            <span className="text-xs font-bold uppercase tracking-widest">Active Listings</span>
          </div>
          <h3 className="text-2xl font-extrabold text-secondary">{stats.active}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-foreground/50">
            <Archive className="w-5 h-5 text-warning" />
            <span className="text-xs font-bold uppercase tracking-widest">Pending Orders</span>
          </div>
          <h3 className="text-2xl font-extrabold text-secondary">{stats.pendingOrders}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-foreground/50">
            <DollarSign className="w-5 h-5 text-destructive" />
            <span className="text-xs font-bold uppercase tracking-widest">Total Revenue</span>
          </div>
          <h3 className="text-2xl font-extrabold text-secondary">${stats.revenue.toLocaleString()}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border shadow-sm items-center">
        <div className="flex gap-2">
          {["all", "active", "out_of_stock", "inactive"].map(s => (
            <button 
              key={s} 
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === s ? "bg-secondary text-white shadow-sm" : "bg-slate-50 text-foreground/60 hover:bg-slate-100"
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-border mx-2"></div>
        <div className="flex items-center gap-2 flex-1">
          <Tag className="w-4 h-4 text-foreground/40" />
          <select 
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="bg-slate-50 border rounded-lg px-3 py-1.5 text-xs font-bold capitalize outline-none focus:ring-2 focus:ring-secondary/20"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center p-12">
           <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
           <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
           <p className="font-semibold">No products found matching filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div whileHover={{ y: -4 }} key={product.id} className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col group">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img src={product.image_url || `https://picsum.photos/seed/${product.id}/400/300`} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-white/90 backdrop-blur text-secondary text-[10px] font-black px-2 py-1 rounded shadow-sm capitalize">
                    {product.category}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider ${
                    product.status === 'active' ? 'bg-success/90 text-white' : 'bg-slate-800/90 text-white'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-secondary text-base leading-tight mb-1">{product.name}</h3>
                <p className="text-[10px] text-foreground/50 uppercase tracking-widest font-bold mb-3">Stock: {product.stock} units</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-extrabold text-secondary">${parseFloat(product.price).toFixed(2)}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(product)} className="p-1.5 bg-slate-100 text-secondary hover:bg-slate-200 rounded-md transition-colors shadow-sm">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-red-50 text-destructive hover:bg-red-100 rounded-md transition-colors shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
           <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
             Showing {products.length} of {total}
           </span>
           <div className="flex gap-2">
             <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Prev</button>
             <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">Next</button>
           </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b bg-slate-50">
              <h2 className="text-lg font-bold text-secondary">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-foreground/50 hover:text-secondary bg-white p-1 rounded-md border shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Product Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none" placeholder="e.g. Eco-friendly T-Shirt" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none capitalize">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Price ($)</label>
                  <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none" placeholder="0.00" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Stock Level</label>
                  <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none" placeholder="100" />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Image URL (optional)</label>
                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none" placeholder="https://..." />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/20 outline-none" placeholder="Product details..." rows={4} />
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-lg font-semibold text-sm border bg-white hover:bg-slate-100 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 rounded-lg font-semibold text-sm bg-secondary text-white hover:bg-secondary/90 shadow-md transition-all">
                Save Product
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}