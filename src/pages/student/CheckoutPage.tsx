import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  email: string;
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
  { id: 3, label: "Verification", icon: CheckCircle2 },
  { id: 4, label: "Payment", icon: CreditCard },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 overflow-x-auto pb-4">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center min-w-[80px]">
            <div className="flex flex-col items-center gap-1.5 w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm shrink-0
                ${done ? "bg-success text-white" : active ? "bg-secondary text-white ring-4 ring-secondary/20" : "bg-slate-100 text-slate-400"}`}>
                {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                ${active ? "text-secondary" : done ? "text-success" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-16 md:w-24 h-0.5 mb-5 mx-2 transition-all duration-500 shrink-0 ${done ? "bg-success" : "bg-slate-200"}`} />
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
        <button onClick={() => navigate("/marketplace")} className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-destructive transition-colors">
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
        <button onClick={() => navigate("/marketplace")}
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

  const field = (key: keyof Address, label: string, placeholder: string, half = false, type = "text") => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
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
          <MapPin className="w-4 h-4 text-destructive" /> Delivery Details
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {field("fullName", "Full Name", user?.name || "Enter full name")}
          {field("email", "Email Address", user?.email || "Enter email address", false, "email")}
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
          Proceed to Verify <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

// ─── Step 3: Verification ─────────────────────────────────────────────────────
function StepVerification({ onNext, onBack, address }: {
  onNext: () => void;
  onBack: () => void;
  address: Address;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/auth/send-checkout-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + "/auth/verify-checkout-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address.email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      onNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="font-bold text-secondary mb-2 text-xl">Verify your Email</h4>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
          We need to verify your email address (<strong className="text-secondary">{address.email}</strong>) before proceeding to payment.
        </p>

        {error && <div className="text-destructive bg-destructive/10 p-3 rounded-lg text-sm mb-4 font-semibold max-w-sm mx-auto">{error}</div>}

        {!sent ? (
          <button 
            onClick={sendOtp} 
            disabled={loading}
            className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-destructive transition-colors disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send Verification OTP"}
          </button>
        ) : (
          <form onSubmit={verifyOtp} className="max-w-xs mx-auto space-y-4">
            <div>
              <input
                type="text"
                placeholder="• • • • • •"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                required
                className="w-full text-center tracking-[0.5em] text-2xl font-bold px-4 py-3 rounded-xl border border-border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || otp.length !== 6}
              className="w-full bg-success text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Proceed to Payment"}
            </button>
            <button 
              type="button" 
              onClick={sendOtp} 
              disabled={loading}
              className="text-sm text-secondary font-semibold hover:text-destructive transition-colors"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>

      <div className="flex justify-start">
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Address
        </button>
      </div>
    </div>
  );
}


// ─── Step 4: Payment ──────────────────────────────────────────────────────────
function StepPayment({ onBack, address, onSuccess }: {
  onBack: () => void;
  address: Address;
  onSuccess: () => void;
}) {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [agreed, setAgreed] = useState(false);
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
        email: address.email || user?.email,
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
          <span className="font-semibold text-secondary">{address.fullName}</span> · {address.email} · {address.phone}<br />
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

      {/* Policy Agreement Checkbox */}
      <div className="flex items-start gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
        <input 
          type="checkbox" 
          id="agreeCheckoutPolicies" 
          checked={agreed} 
          onChange={e => setAgreed(e.target.checked)} 
          className="w-4.5 h-4.5 mt-0.5 rounded border-border text-secondary focus:ring-secondary/20 transition-all cursor-pointer" 
        />
        <label htmlFor="agreeCheckoutPolicies" className="text-xs text-foreground/75 cursor-pointer leading-relaxed">
          I agree to the <Link to="/terms" target="_blank" className="text-secondary font-semibold hover:underline">Terms of Service</Link>, <Link to="/privacy" target="_blank" className="text-secondary font-semibold hover:underline">Privacy Policy</Link>, and <Link to="/refund-policy" target="_blank" className="text-secondary font-semibold hover:underline">Refund Policy</Link> for this payment.
        </label>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <motion.button
          whileHover={{ scale: paying || !agreed ? 1 : 1.02 }}
          whileTap={{ scale: paying || !agreed ? 1 : 0.98 }}
          onClick={handlePayment}
          disabled={paying || !agreed}
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => navigate("/marketplace")}
          className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors">
          Continue Shopping
        </button>
        <button onClick={() => navigate("/")}
          className="bg-white border px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors text-secondary">
          Go to Home
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Checkout Page ────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  
  const [address, setAddress] = useState<Address>({
    fullName: user?.name || "", 
    email: user?.email || "", 
    phone: "", 
    addressLine1: "", 
    addressLine2: "",
    city: "", 
    state: "", 
    pincode: "",
  });

  if (success) return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <OrderSuccess />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary">Checkout</h1>
        <p className="text-muted-foreground mt-1">Complete your order safely and securely.</p>
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
            <StepVerification
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
              address={address}
            />
          )}
          {step === 4 && (
            <StepPayment
              onBack={() => setStep(3)}
              address={address}
              onSuccess={() => setSuccess(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
