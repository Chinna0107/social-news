import { Link } from "react-router-dom";

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-secondary mb-3 tracking-tight">Shipping & Delivery Policy</h1>
        <p className="text-sm text-foreground/50">Last updated: June 23, 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">1. Overview</h2>
          <p>
            This Shipping & Delivery Policy outlines the terms and conditions for the delivery of physical products
            purchased through the Social Voice News (Social News) Marketplace at{" "}
            <a href="https://socialvoicenews.com" className="text-destructive hover:underline font-semibold">socialvoicenews.com</a>.
            All payments are securely processed through Razorpay Payment Gateway.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">2. Shipping Coverage</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We currently ship to addresses within <strong>India</strong> only.</li>
            <li>Delivery is available across all states and union territories, subject to courier serviceability.</li>
            <li>For remote or rural areas, delivery timelines may be extended.</li>
            <li>International shipping is not available at this time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">3. Processing Time</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Orders are processed within <strong>1–3 business days</strong> after payment confirmation.</li>
            <li>You will receive an order confirmation email with your order details once the payment is verified.</li>
            <li>Orders placed on weekends or public holidays will be processed on the next business day.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">4. Estimated Delivery Time</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-secondary/5">
                  <th className="border border-border px-4 py-3 text-left font-bold text-secondary">Location</th>
                  <th className="border border-border px-4 py-3 text-left font-bold text-secondary">Estimated Delivery</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-4 py-3">Metro Cities (Hyderabad, Mumbai, Delhi, Bangalore, Chennai, Kolkata)</td>
                  <td className="border border-border px-4 py-3 font-semibold">3–5 business days</td>
                </tr>
                <tr className="bg-secondary/5">
                  <td className="border border-border px-4 py-3">Tier 2 Cities</td>
                  <td className="border border-border px-4 py-3 font-semibold">5–7 business days</td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-3">Rural / Remote Areas</td>
                  <td className="border border-border px-4 py-3 font-semibold">7–10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-3 text-foreground/60">
            <strong>Note:</strong> Delivery times are estimates and may vary due to courier availability, weather conditions,
            natural disasters, or unforeseen circumstances. We are not responsible for delays caused by the courier partner.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">5. Shipping Charges</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Shipping charges (if applicable) will be displayed at checkout before payment.</li>
            <li>Free shipping may be offered on select products or during promotional campaigns.</li>
            <li>Any applicable taxes or duties are included in the final order amount.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">6. Order Tracking</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Once your order is shipped, you will receive a tracking ID via email or SMS.</li>
            <li>You can track your order status from your <strong>Student/User Dashboard → Orders</strong> section.</li>
            <li>For any tracking issues, please contact our support team.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">7. Failed Delivery</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>If a delivery attempt fails due to an incorrect address, unavailability of the recipient, or refusal to accept,
              the order may be returned to us.</li>
            <li>In such cases, re-shipping charges may apply.</li>
            <li>Please ensure your delivery address and phone number are accurate at the time of placing the order.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">8. Damaged or Lost Shipments</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>If your order arrives damaged, please contact us within <strong>48 hours</strong> of delivery with
              photographs of the packaging and product.</li>
            <li>We will arrange a replacement or full refund as per our{" "}
              <Link to="/refund-policy" className="text-destructive hover:underline font-semibold">Refund & Cancellation Policy</Link>.</li>
            <li>If your shipment is lost in transit, we will investigate with the courier partner and provide a resolution
              within <strong>7–10 business days</strong>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">9. Digital Products</h2>
          <p>
            Digital products such as certificates, ID cards, and selfie frames are delivered electronically through
            your dashboard. No physical shipping is involved for digital products, and they are available for download
            or access immediately after purchase/completion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">10. Contact Us</h2>
          <p>For any shipping-related queries, reach out to us:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Email:</strong>{" "}
              <a href="mailto:support@socialvoicenews.com" className="text-destructive hover:underline font-semibold">support@socialvoicenews.com</a>
            </li>
            <li><strong>Phone:</strong> +91 9247896607</li>
            <li><strong>Business Address:</strong> Social Voice News, Hyderabad, Telangana, India</li>
            <li><strong>Website:</strong>{" "}
              <a href="https://socialvoicenews.com" className="text-destructive hover:underline font-semibold">https://socialvoicenews.com</a>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-6 text-sm font-semibold">
        <Link to="/refund-policy" className="text-secondary hover:text-destructive transition-colors">Refund & Cancellation Policy →</Link>
        <Link to="/terms" className="text-secondary hover:text-destructive transition-colors">Terms of Service →</Link>
        <Link to="/privacy" className="text-secondary hover:text-destructive transition-colors">Privacy Policy →</Link>
      </div>
    </div>
  );
}
