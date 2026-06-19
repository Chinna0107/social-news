import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { studentApi } from "@/utils/api";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Plus, Minus, Check, Search } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function MarketplacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/user") ? "/user" : "/student";
  const { addToCart, updateQty, items, totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Derived categories
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

  // Filtered Products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    studentApi.marketplace()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getCartItem = (id: string) => items.find(i => i._id === id);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setJustAdded(product._id);
    setTimeout(() => setJustAdded(null), 1500);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-2">Support causes by purchasing sustainable products.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`${basePath}/checkout`)}
          className="relative bg-secondary text-white rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-secondary/90 transition-colors shadow-md"
        >
          <ShoppingCart className="w-4 h-4" />
          View Cart
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-destructive text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow"
              >
                {totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Search & Filter Bar */}
      {!loading && (
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === null ? "bg-secondary text-white" : "bg-white text-secondary hover:bg-slate-50 border"
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat ? "bg-secondary text-white" : "bg-white text-secondary hover:bg-slate-50 border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-8 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-muted-foreground">No products found matching your search.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                className="mt-4 text-secondary font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const cartItem = getCartItem(product._id);
            const added = justAdded === product._id;

            return (
              <motion.div
                key={product._id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <AnimatePresence>
                    {added && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-success/80 flex items-center justify-center"
                      >
                        <div className="bg-white rounded-full p-3 shadow-lg">
                          <Check className="w-6 h-6 text-success" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-4">
                  {product.category && (
                    <span className="text-[10px] font-black tracking-wider uppercase text-secondary/60 bg-secondary/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                      {product.category}
                    </span>
                  )}
                  <h3 className="font-bold text-base mb-1 group-hover:text-destructive transition-colors leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xl text-secondary">${Number(product.price).toFixed(2)}</span>

                    {cartItem ? (
                      <div className="flex items-center gap-1 bg-secondary/10 rounded-lg p-1">
                        <button
                          onClick={() => updateQty(product._id, cartItem.qty - 1)}
                          className="w-7 h-7 rounded-md bg-white border flex items-center justify-center hover:bg-destructive hover:text-white hover:border-destructive transition-colors shadow-sm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-secondary">{cartItem.qty}</span>
                        <button
                          onClick={() => updateQty(product._id, cartItem.qty + 1)}
                          className="w-7 h-7 rounded-md bg-secondary text-white flex items-center justify-center hover:bg-destructive transition-colors shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="bg-secondary text-white px-3 py-2 rounded-lg hover:bg-destructive transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          }))}
        </motion.div>
      )}

      {/* Sticky checkout bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={() => navigate(`${basePath}/checkout`)}
              className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-3 hover:bg-destructive transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Checkout — {totalItems} item{totalItems > 1 ? "s" : ""}
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-black">
                ${items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
