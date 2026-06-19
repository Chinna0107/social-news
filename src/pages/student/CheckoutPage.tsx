import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  ShoppingCart, MapPin, CreditCard,
  CheckCircle2, Trash2, Plus, Minus,
  ArrowLeft, ArrowRight, Package
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_YourKeyHere";

// ─── Step Indicator ───────────────────────────────────────────────────────────
const steps = [
  { id: 1, label: "Confirm Cart", icon: ShoppingCart },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "Payment", icon: CreditCard },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm
                ${done ? "bg-success text-white" : active ? "bg-secondary text-white ring-4 ring-secondary/20" : "bg-slate-100 text-slate-400"}`}>
                {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                ${active ? "text-secondary" : done ? "text-success" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 md:w-24 h-0.5 mb-5 mx-2 transition-all duration-500 ${done ? "bg-success" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Confirm Cart ─────────────────────────────────────────────────────
function StepCart({ onNext }: { onNext: () => void }) {
  const { items, updateQty, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-secondary mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6">Add some products from the marketplace first.</p>
        <button onClick={() => navigate("/student/marketplace")} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-destructive transition-colors">
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map(item => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-2xl border shadow-sm p-4 flex gap-4 items-center"
          >
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-secondary leading-tight truncate">{item.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
              <p className="text-sm font-extrabold text-secondary mt-1">${(item.price * item.qty).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => updateQty(item._id, item.qty - 1)}
                className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-slate-100 transition-colors">
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
              <button onClick={() => updateQty(item._id, item.qty + 1)}
                className="w-7 h-7 rounded-lg bg-secondary text-white flex items-center justify-center hover:bg-destructive transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <button onClick={() => removeFromCart(item._id)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h4 className="font-bold text-sm text-secondary mb-3 uppercase tracking-wider">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="text-success font-semibold">Free</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax (18% GST)</span>
            <span>${(totalPrice * 0.18).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-extrabold text-secondary text-base">
            <span>Total</span>
            <span>${(totalPrice * 1.18).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={() => navigate("/student/marketplace")}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-destructive transition-colors shadow-md">
          Proceed to Address <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Address ──────────────────────────────────────────────────────────
function StepAddress({ onNext, onBack, address, setAddress }: {
  onNext: () => void;
  onBack: () => void;
  address: Address;
  setAddress: (a: Address) => void;
}) {
  const { user } = useAuth();

  const field = (key: keyof Address, label: string, placeholder: string, half = false) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        value={address[key]}
        onChange={e => setAddress({ ...address, [key]: e.target.value })}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
      />
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h4 className="font-bold text-secondary mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-destructive" /> Delivery Address
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {field("fullName", "Full Name", user?.name || "Enter full name")}
          {field("phone", "Phone Number", "10-digit mobile number")}
          {field("addressLine1", "Address Line 1", "House / Flat / Building")}
          {field("addressLine2", "Address Line 2 (Optional)", "Street / Area / Colony")}
          {field("city", "City", "City", true)}
          {field("state", "State", "State", true)}
          {field("pincode", "PIN Code", "6-digit PIN", true)}
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>
        <button type="submit"
          className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-destructive transition-colors shadow-md">
          Proceed to Payment <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

// ─── Step 3: Payment ──────────────────────────────────────────────────────────
function StepPayment({ onBack, address, onSuccess }: {
  onBack: () => void;
  address: Address;
  onSuccess: () => void;
}) {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const total = Math.round(totalPrice * 1.18 * 100); // paise

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise(resolve => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaying(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load. Check your connection.");
      setPaying(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: total,
      currency: "INR",
      name: "Social News Marketplace",
      description: `Order of ${items.length} item(s)`,
      image: "/logo.png",
      prefill: {
        name: address.fullName || user?.name,
        email: user?.email,
        contact: address.phone,
      },
      notes: {
        address: `${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`,
      },
      theme: { color: "#011B4A" },
      handler: () => {
        clearCart();
        onSuccess();
      },
      modal: {
        ondismiss: () => setPaying(false),
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", () => {
      alert("Payment failed. Please try again.");
      setPaying(false);
    });
    rzp.open();
  };

  return (
    <div className="space-y-5">
      {/* Order items mini */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h4 className="font-bold text-sm text-secondary mb-3 uppercase tracking-wider">Items in Order</h4>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item._id} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                <span className="font-medium text-secondary">{item.name} <span className="text-muted-foreground">×{item.qty}</span></span>
              </div>
              <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery address recap */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h4 className="font-bold text-sm text-secondary mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-destructive" /> Delivering To
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-secondary">{address.fullName}</span> · {address.phone}<br />
          {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}<br />
          {address.city}, {address.state} — {address.pincode}
        </p>
      </div>

      {/* Total */}
      <div className="bg-secondary text-white rounded-2xl p-5">
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-white/70">Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-white/70">GST (18%)</span>
          <span>${(totalPrice * 0.18).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xl font-extrabold border-t border-white/20 pt-3">
          <span>Total Payable</span>
          <span>₹{(totalPrice * 1.18).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Edit Address
        </button>
        <motion.button
          whileHover={{ scale: paying ? 1 : 1.02 }}
          whileTap={{ scale: paying ? 1 : 0.98 }}
          onClick={handlePayment}
          disabled={paying}
          className="flex items-center gap-2 bg-destructive text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {paying ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
          ) : (
            <><CreditCard className="w-4 h-4" /> Pay with Razorpay</>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────────
function OrderSuccess() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>
      <h2 className="text-3xl font-extrabold text-secondary mb-3">Order Placed!</h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Your payment was successful. Your order has been confirmed and will be delivered soon.
      </p>
      <div className="flex gap-4 justify-center">
        <button onClick={() => navigate("/student/marketplace")}
          className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors">
          Continue Shopping
        </button>
        <button onClick={() => navigate("/student/dashboard")}
          className="bg-white border px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors text-secondary">
          Go to Dashboard
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Checkout Page ────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState<Address>({
    fullName: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "", pincode: "",
  });

  if (success) return (
    <div className="max-w-2xl mx-auto">
      <OrderSuccess />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary">Checkout</h1>
        <p className="text-muted-foreground mt-1">Complete your order in 3 simple steps.</p>
      </div>

      <StepBar current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && <StepCart onNext={() => setStep(2)} />}
          {step === 2 && (
            <StepAddress
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              address={address}
              setAddress={setAddress}
            />
          )}
          {step === 3 && (
            <StepPayment
              onBack={() => setStep(2)}
              address={address}
              onSuccess={() => setSuccess(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
