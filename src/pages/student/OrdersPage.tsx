import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Package, Clock, CheckCircle2, Truck, XCircle, AlertCircle } from "lucide-react";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  address: string;
  status: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We fetch from the new endpoint we added
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/student/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return { icon: Clock, color: "text-amber-500", bg: "bg-amber-100", text: "Pending" };
      case "shipped": return { icon: Truck, color: "text-blue-500", bg: "bg-blue-100", text: "Shipped" };
      case "delivered": return { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", text: "Delivered" };
      case "cancelled": return { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", text: "Cancelled" };
      default: return { icon: AlertCircle, color: "text-slate-500", bg: "bg-slate-100", text: status };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage your marketplace orders.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border shadow-sm animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-secondary">No orders yet</p>
          <p className="text-muted-foreground">When you buy items from the marketplace, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusInfo(order.status);
            const StatusIcon = status.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id}
                className="bg-white rounded-2xl border shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-4 mb-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Order ID</p>
                    <p className="font-mono font-bold text-secondary">{order.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total</p>
                      <p className="font-extrabold text-secondary">${Number(order.total).toFixed(2)}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border ${status.bg} ${status.color} border-current/20`}>
                      <StatusIcon className="w-4 h-4" />
                      {status.text}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Items</p>
                  <div className="grid gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg border shadow-sm flex items-center justify-center font-bold text-secondary">
                            {item.qty}x
                          </div>
                          <p className="font-semibold text-secondary">{item.name}</p>
                        </div>
                        <p className="font-bold text-secondary">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Shipping Address</p>
                  <p className="text-sm text-secondary">{order.address}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
