import { useState, useEffect } from "react";
import { Package, Filter, Loader2 } from "lucide-react";
import { apiRequest } from "@/contexts/AuthContext";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  user_name: string;
  user_email: string;
  items: OrderItem[];
  total: number;
  address: string;
  status: string;
  created_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = `/admin/orders${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`;
      const data = await apiRequest(url);
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await apiRequest(`/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded text-xs font-bold">Pending</span>;
      case "shipped": return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-bold">Shipped</span>;
      case "delivered": return <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-bold">Delivered</span>;
      case "cancelled": return <span className="px-2 py-1 bg-destructive/20 text-destructive rounded text-xs font-bold">Cancelled</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{status}</span>;
    }
  };

  const statuses = ["pending", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground mt-1">Manage marketplace orders and fulfillments.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm font-bold text-secondary">
          <Filter className="w-4 h-4" /> Filter by Status:
        </div>
        <div className="flex gap-2">
          {["all", ...statuses].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${
                statusFilter === status ? "bg-secondary text-white" : "bg-slate-50 text-secondary hover:bg-slate-100 border"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border shadow-sm animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-secondary">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden text-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">Order ID & Date</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Items & Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 align-top">
                    <p className="font-mono font-bold text-secondary">{order.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="font-bold text-secondary">{order.user_name}</p>
                    <p className="text-xs text-muted-foreground">{order.user_email}</p>
                    <p className="text-xs text-secondary mt-2 max-w-[200px] line-clamp-2" title={order.address}>
                      {order.address}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-1 mb-2">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-xs text-secondary">
                          <span className="font-bold">{item.qty}x</span> {item.name}
                        </p>
                      ))}
                    </div>
                    <p className="font-extrabold text-secondary">${Number(order.total).toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 align-top">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 align-top text-right relative">
                    {updating === order.id ? (
                      <div className="flex items-center justify-end gap-2 text-xs font-bold text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                      </div>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-white border text-xs font-bold rounded p-2 text-secondary outline-none focus:ring-2 focus:ring-secondary/20"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
