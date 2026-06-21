import { Link } from "react-router-dom";

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-secondary mb-3 tracking-tight">Refund & Cancellation Policy</h1>
        <p className="text-sm text-foreground/50">Last updated: June 20, 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">1. Marketplace Purchases</h2>
          <h3 className="text-lg font-semibold text-secondary/80 mb-2">Cancellation</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Orders can be cancelled within <strong>24 hours</strong> of placing the order, provided the item has not been shipped.</li>
            <li>To cancel an order, contact us at <a href="mailto:support@socialnews.org" className="text-destructive hover:underline font-semibold">support@socialnews.org</a> with your order ID.</li>
            <li>Once an order has been shipped, it cannot be cancelled.</li>
          </ul>

          <h3 className="text-lg font-semibold text-secondary/80 mb-2 mt-4">Returns & Refunds</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Products can be returned within <strong>7 days</strong> of delivery if they are defective, damaged, or not as described.</li>
            <li>Items must be returned in their original packaging and unused condition.</li>
            <li>Refunds will be processed within <strong>5–7 business days</strong> after we receive and inspect the returned item.</li>
            <li>Refunds will be credited to the original payment method.</li>
            <li>Shipping costs are non-refundable unless the return is due to our error.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">2. Donations</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Donations are generally <strong>non-refundable</strong> as they are directed to active campaigns immediately.</li>
            <li>In exceptional circumstances (e.g., duplicate transactions, unauthorized payments), refund requests will be reviewed on a case-by-case basis.</li>
            <li>Refund requests for donations must be submitted within <strong>48 hours</strong> of the transaction.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">3. How to Request a Refund</h2>
          <p>To initiate a refund or return, please follow these steps:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Email us</strong> at{" "}
              <a href="mailto:support@socialnews.org" className="text-destructive hover:underline font-semibold">support@socialnews.org</a>{" "}
              with the subject line "Refund Request".
            </li>
            <li>
              Include your <strong>order ID</strong>, <strong>registered email</strong>, and <strong>reason for the refund</strong>.
            </li>
            <li>
              Our team will review your request and respond within <strong>2 business days</strong>.
            </li>
            <li>
              If approved, you will receive instructions for returning the item (for marketplace purchases).
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">4. Non-Refundable Items</h2>
          <p>The following are not eligible for refunds:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Digital certificates and ID cards</li>
            <li>Impact points and levels</li>
            <li>Completed campaign donations (except as noted above)</li>
            <li>Items returned after the 7-day return window</li>
            <li>Items that have been used, altered, or damaged by the buyer</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">5. Damaged or Incorrect Items</h2>
          <p>
            If you receive a damaged or incorrect item, please contact us within <strong>48 hours</strong> of 
            delivery with photos of the item and packaging. We will arrange a free replacement or full refund 
            at no additional cost to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">6. Contact Us</h2>
          <p>
            For any questions regarding refunds or cancellations, reach out to us at:{" "}
            <a href="mailto:support@socialnews.org" className="text-destructive hover:underline font-semibold">support@socialnews.org</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex gap-6 text-sm font-semibold">
        <Link to="/privacy" className="text-secondary hover:text-destructive transition-colors">Privacy Policy →</Link>
        <Link to="/terms" className="text-secondary hover:text-destructive transition-colors">Terms of Service →</Link>
      </div>
    </div>
  );
}
