import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { publicApi } from "@/utils/api";
import { ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.marketplace()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-8 md:px-16">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12">
        <motion.div variants={fadeUp} className="max-w-2xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-secondary mb-4">Impact Marketplace</h1>
          <p className="text-lg text-muted-foreground">Every purchase directly funds our ongoing campaigns. Support the cause while getting sustainable, ethically sourced goods.</p>
        </motion.div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading products...</p>
        ) : (
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl border shadow-sm overflow-hidden group hover:shadow-lg transition-all">
                <div className="h-64 relative overflow-hidden bg-slate-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-secondary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    100% Not-For-Profit
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-destructive transition-colors">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-extrabold text-2xl text-secondary">${product.price.toFixed(2)}</span>
                    <button className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-destructive transition-colors font-semibold text-sm flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
