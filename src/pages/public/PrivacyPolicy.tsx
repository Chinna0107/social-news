import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-secondary mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-foreground/50">Last updated: June 20, 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">1. Introduction</h2>
          <p>
            Welcome to Social News ("we," "our," or "us"). We are committed to protecting your privacy and personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
            website and use our services including news, campaigns, marketplace, donations, quizzes, and tasks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold text-secondary/80 mb-2">Personal Information</h3>
          <p>When you register or use our services, we may collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name, email address, phone number</li>
            <li>Age, gender, college/institution name, and address</li>
            <li>Profile picture/avatar</li>
            <li>Payment information (for marketplace purchases and donations)</li>
            <li>Student ID and academic details</li>
          </ul>

          <h3 className="text-lg font-semibold text-secondary/80 mb-2 mt-4">Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>IP address, browser type, operating system</li>
            <li>Pages visited, time spent on pages</li>
            <li>Device information and cookies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">3. How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Creating and managing your account</li>
            <li>Providing personalized news content and recommendations</li>
            <li>Processing marketplace orders and donations</li>
            <li>Issuing certificates, ID cards, and tracking impact points</li>
            <li>Sending notifications about campaigns, tasks, and quizzes</li>
            <li>Improving our services and user experience</li>
            <li>Communicating important updates and responding to enquiries</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">4. Data Sharing & Disclosure</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Service Providers:</strong> Cloud hosting (Vercel, Neon DB), media storage (Cloudinary), payment processors (Razorpay)</li>
            <li><strong>Campaign Partners:</strong> Anonymized participation data for campaign reporting</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">5. Data Security</h2>
          <p>
            We implement industry-standard security measures including encrypted data transmission (SSL/TLS), 
            hashed passwords (bcrypt), secure token-based authentication (JWT), and access-controlled database storage. 
            However, no method of electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">6. Cookies</h2>
          <p>
            We use essential cookies and local storage to maintain your login session and preferences. 
            Third-party services like Google AdSense may use cookies for ad personalization. 
            You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, update, or delete your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at{" "}
            <a href="mailto:support@socialnews.org" className="text-destructive hover:underline font-semibold">support@socialnews.org</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">8. Children's Privacy</h2>
          <p>
            Our services are not directed at children under 13. We do not knowingly collect personal 
            information from children under 13. If we discover such data, we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date. 
            Your continued use of our services constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:{" "}
            <a href="mailto:support@socialnews.org" className="text-destructive hover:underline font-semibold">support@socialnews.org</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex gap-6 text-sm font-semibold">
        <Link to="/terms" className="text-secondary hover:text-destructive transition-colors">Terms of Service →</Link>
        <Link to="/refund-policy" className="text-secondary hover:text-destructive transition-colors">Refund Policy →</Link>
      </div>
    </div>
  );
}
