import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartHandshake, X, CheckCircle2, Loader2, IndianRupee, MapPin, User, Mail, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PRESETS = [100, 500, 1000, 2000, 5000];

interface Campaign {
  id: string;
  title: string;
  description?: string;
  image?: string;
  goal?: number;
  collected?: number;
}

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCampaign: Campaign | null;
  onSuccess?: () => void;
}

export default function DonationModal({ isOpen, onClose, selectedCampaign, onSuccess }: DonationModalProps) {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Payment
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState("");
  const [amount, setAmount] = useState("");
  
  // Donor details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // OTP Verification state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Payment state
  const [agreePolicies, setAgreePolicies] = useState(false);
  const [paying, setPaying] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState(false);

  // Fetch campaigns if not pre-selected
  useEffect(() => {
    if (isOpen) {
      // Reset state
      setStep(1);
      setAmount("");
      setName("");
      setEmail("");
      setPhone("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPincode("");
      setOtp("");
      setOtpSent(false);
      setOtpError("");
      setAgreePolicies(false);
      setDonateSuccess(false);

      if (selectedCampaign) {
        setCampaignId(selectedCampaign.id);
      } else {
        fetch(`${API_BASE_URL}/donations/campaigns`)
          .then(r => r.json())
          .then((data: any) => {
            const list = Array.isArray(data) ? data : [];
            setCampaigns(list);
            if (list.length > 0) setCampaignId(list[0].id);
          })
          .catch(console.error);
      }
    }
  }, [isOpen, selectedCampaign]);

  const activeCampaign = selectedCampaign || campaigns.find(c => c.id === campaignId);

  const handleSendOtp = async () => {
    if (!email) {
      setOtpError("Email address is required.");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-checkout-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
    } catch (err: any) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-checkout-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      setStep(3);
    } catch (err: any) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

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
    const amt = parseFloat(amount);
    if (!activeCampaign || !amt || amt <= 0) return;
    setPaying(true);

    try {
      // 1. Create order
      const orderRes = await fetch(`${API_BASE_URL}/donations/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt })
      });
      if (!orderRes.ok) throw new Error("Could not create donation order");
      const orderData = await orderRes.json();

      const processDonation = async (paymentId: string) => {
        const fullAddress = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${state} - ${pincode}`;
        const res = await fetch(`${API_BASE_URL}/donations/donate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaign_id: activeCampaign.id,
            amount: amt,
            donor_name: name,
            donor_email: email,
            user_id: null,
            payment_id: paymentId,
            message: `[Phone: ${phone}] [Address: ${fullAddress}]`
          }),
        });
        if (!res.ok) throw new Error("Could not save donation record");
        
        setDonateSuccess(true);
        setPaying(false);
        if (onSuccess) onSuccess();
      };

      if (orderData.mock) {
        await processDonation("pay_mock_" + Date.now());
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay failed to load");
        setPaying(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Social News",
        description: `Donation for ${activeCampaign.title}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          await processDonation(response.razorpay_payment_id);
        },
        prefill: {
          name,
          email,
          contact: phone
        },
        notes: {
          address: `${addressLine1}, ${city}, ${state} - ${pincode}`
        },
        theme: { color: "#f59e0b" },
        modal: {
          ondismiss: () => setPaying(false),
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function () {
        alert("Payment failed");
        setPaying(false);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
      setPaying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white shrink-0 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <HeartHandshake className="w-8 h-8 mb-2 opacity-90" />
            <p className="text-xs font-black uppercase tracking-widest opacity-75 mb-1">Make a Donation</p>
            <h2 className="text-xl font-extrabold pr-8 leading-tight">
              {activeCampaign ? activeCampaign.title : "Direct Donation"}
            </h2>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {donateSuccess ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9 text-success" />
                </div>
                <h3 className="text-2xl font-black text-secondary mb-2">Thank You! 🙏</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Your donation of <span className="font-extrabold text-success">₹{parseFloat(amount).toLocaleString("en-IN")}</span> was received and verified successfully.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 transition-colors shadow-md"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                {/* Step Indicator */}
                <div className="flex items-center gap-2 pb-2 border-b">
                  {[
                    { s: 1, label: "Details" },
                    { s: 2, label: "Verify" },
                    { s: 3, label: "Pay" }
                  ].map(stepObj => (
                    <div key={stepObj.s} className="flex items-center gap-1.5 flex-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step >= stepObj.s ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                        {stepObj.s}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        step >= stepObj.s ? "text-secondary" : "text-slate-400"
                      }`}>{stepObj.label}</span>
                      {stepObj.s < 3 && <div className="flex-1 h-0.5 bg-slate-100" />}
                    </div>
                  ))}
                </div>

                {/* Step 1: Details */}
                {step === 1 && (
                  <div className="space-y-4">
                    {/* Campaign Selector if not preselected */}
                    {!selectedCampaign && campaigns.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">Choose Campaign</label>
                        <select
                          value={campaignId}
                          onChange={e => setCampaignId(e.target.value)}
                          className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 capitalize bg-white"
                        >
                          {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Presets */}
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Select Donation Amount</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {PRESETS.map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setAmount(String(p))}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              amount === String(p)
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-slate-50 border-border hover:border-amber-400 hover:text-amber-600"
                            }`}
                          >
                            ₹{p >= 1000 ? `${p / 1000}k` : p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">Custom Amount (₹)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="number"
                          min="10"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          required
                          className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-400/40"
                        />
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-slate-50/50 p-4 rounded-2xl border space-y-3">
                      <h4 className="font-bold text-xs text-secondary uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-500" /> Donor Info
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address details */}
                    <div className="bg-slate-50/50 p-4 rounded-2xl border space-y-3">
                      <h4 className="font-bold text-xs text-secondary uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" /> Address Details
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Address Line 1 (House/Flat/Colony)"
                            value={addressLine1}
                            onChange={e => setAddressLine1(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="Address Line 2 (Optional)"
                            value={addressLine2}
                            onChange={e => setAddressLine2(e.target.value)}
                            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="text"
                            placeholder="State"
                            value={state}
                            onChange={e => setState(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="text"
                            placeholder="Pincode"
                            value={pincode}
                            onChange={e => setPincode(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!amount || parseFloat(amount) <= 0 || !name || !email || !phone || !addressLine1 || !city || !state || !pincode}
                      className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-destructive disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                    >
                      Proceed to Verification
                    </button>
                  </div>
                )}

                {/* Step 2: Verification */}
                {step === 2 && (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-secondary text-lg">Verify Email</h4>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      To complete the donation, please verify your email: <strong>{email}</strong>.
                    </p>

                    {otpError && (
                      <div className="text-destructive bg-destructive/10 p-2.5 rounded-xl text-xs font-semibold max-w-xs mx-auto">
                        {otpError}
                      </div>
                    )}

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-all text-sm disabled:opacity-50"
                      >
                        {otpLoading ? "Sending OTP..." : "Send Verification OTP"}
                      </button>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="max-w-xs mx-auto space-y-4">
                        <input
                          type="text"
                          placeholder="• • • • • •"
                          value={otp}
                          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                          maxLength={6}
                          required
                          className="w-full text-center tracking-[0.5em] text-2xl font-bold px-3 py-2 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                        />
                        <button
                          type="submit"
                          disabled={otpLoading || otp.length !== 6}
                          className="w-full bg-success text-white py-2.5 rounded-xl font-bold hover:bg-green-600 transition-all disabled:opacity-50 text-sm"
                        >
                          {otpLoading ? "Verifying..." : "Verify & Proceed"}
                        </button>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpLoading}
                          className="text-xs text-secondary font-semibold hover:text-destructive transition-colors block mx-auto"
                        >
                          Resend OTP
                        </button>
                      </form>
                    )}

                    <div className="pt-4 border-t flex justify-start">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-muted-foreground hover:text-secondary flex items-center gap-1"
                      >
                        ← Back to Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment & Policies */}
                {step === 3 && (
                  <div className="space-y-4">
                    {/* Donation Summary */}
                    <div className="bg-slate-50 border rounded-2xl p-4 space-y-2">
                      <h4 className="font-bold text-xs text-secondary uppercase tracking-widest border-b pb-1.5">Donation Summary</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Donor</span>
                        <span className="font-bold text-secondary">{name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-semibold text-secondary">{email}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Campaign</span>
                        <span className="font-semibold text-secondary">{activeCampaign?.title}</span>
                      </div>
                      <div className="flex justify-between text-base font-extrabold text-secondary border-t pt-2 mt-2">
                        <span>Total Donation</span>
                        <span className="text-success text-lg">₹{parseFloat(amount).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    {/* Policy Agreement Checkbox */}
                    <div className="flex items-start gap-2.5 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                      <input
                        type="checkbox"
                        id="agreeDonationPolicies"
                        checked={agreePolicies}
                        onChange={e => setAgreePolicies(e.target.checked)}
                        className="w-4.5 h-4.5 mt-0.5 rounded border-border text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
                      />
                      <label htmlFor="agreeDonationPolicies" className="text-xs text-foreground/75 cursor-pointer leading-relaxed">
                        I agree to the <Link to="/terms" target="_blank" className="text-secondary font-semibold hover:underline">Terms of Service</Link>, <Link to="/privacy" target="_blank" className="text-secondary font-semibold hover:underline">Privacy Policy</Link>, and <Link to="/refund-policy" target="_blank" className="text-secondary font-semibold hover:underline">Refund Policy</Link> for this payment.
                      </label>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-xs font-bold text-muted-foreground hover:text-secondary"
                      >
                        ← Back to Verify
                      </button>
                      <button
                        type="button"
                        onClick={handlePayment}
                        disabled={paying || !agreePolicies}
                        className="flex items-center gap-2 bg-destructive text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {paying ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                        ) : (
                          <><CreditCard className="w-4 h-4" /> Pay with Razorpay</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
