import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Bell, Check } from "lucide-react";

interface Notification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/student/notifications", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/student/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ((n._id || n.id) === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay updated with your latest news and alerts.</p>
        </div>
        <Bell className="w-6 h-6 text-muted-foreground" />
      </motion.div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <motion.div variants={fadeUp} className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id || notification.id}
              className={`p-4 rounded-xl border ${notification.read ? 'bg-white' : 'bg-slate-50 border-secondary/20'} flex items-start gap-4 transition-colors`}
            >
              <div className="flex-1">
                <h3 className={`font-bold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification._id || notification.id!)}
                  className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  Mark read
                </button>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-muted-foreground">No notifications right now.</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
