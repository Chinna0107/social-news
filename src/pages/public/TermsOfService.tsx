import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-secondary mb-3 tracking-tight">Terms of Service</h1>
        <p className="text-sm text-foreground/50">Last updated: June 20, 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Social News ("the Platform"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services. These terms apply to all users, 
            including students, civic leaders, volunteers, and visitors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">2. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must provide accurate and complete information during registration.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must be at least 13 years old to create an account.</li>
            <li>One person may not maintain more than one account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">3. User Conduct</h2>
          <p>When using our platform, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Post false, misleading, or defamatory content</li>
            <li>Harass, abuse, or threaten other users</li>
            <li>Impersonate any person or entity</li>
            <li>Use the platform for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Upload viruses, malware, or any harmful code</li>
            <li>Scrape, mine, or collect user data without consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">4. News Content</h2>
          <p>
            Social News strives to provide accurate and timely news content. However, we do not guarantee the 
            accuracy, completeness, or timeliness of any content on the platform. News articles represent the 
            views of their authors and do not necessarily reflect the views of Social News.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">5. Campaigns & Tasks</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Campaign participation is voluntary. Impact points are earned based on task completion and quiz performance.</li>
            <li>We reserve the right to approve, reject, or modify task submissions at our discretion.</li>
            <li>Certificates are issued upon successful completion and cannot be transferred.</li>
            <li>Impact points have no monetary value and cannot be exchanged for cash.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">6. Marketplace & Purchases</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>All prices are listed in INR (₹) unless otherwise stated.</li>
            <li>We strive to display accurate product information but do not guarantee error-free descriptions.</li>
            <li>We reserve the right to refuse or cancel orders at any time.</li>
            <li>Payment processing is handled through secure third-party providers (Razorpay).</li>
            <li>For refund information, please refer to our <Link to="/refund-policy" className="text-destructive hover:underline font-semibold">Refund Policy</Link>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">7. Donations</h2>
          <p>
            Donations made through our platform are voluntary. All donations are directed to the specified 
            campaign. We provide transparency on how donations are utilized. Donations may be tax-deductible 
            where applicable — consult your tax advisor for details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">8. Intellectual Property</h2>
          <p>
            All content on Social News, including text, graphics, logos, images, and software, is the 
            property of Social News or its content suppliers and is protected by intellectual property laws. 
            You may not reproduce, distribute, or create derivative works without our written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">9. Limitation of Liability</h2>
          <p>
            Social News is provided on an "as is" and "as available" basis. We shall not be liable for any 
            indirect, incidental, special, or consequential damages arising from your use of the platform, 
            including but not limited to loss of data, profits, or goodwill.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">10. Modifications</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be effective 
            immediately upon posting. Your continued use of the platform constitutes acceptance of the 
            revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">11. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. 
            Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-secondary mb-3">12. Contact</h2>
          <p>
            For questions regarding these terms, contact us at:{" "}
            <a href="mailto:support@socialnews.org" className="text-destructive hover:underline font-semibold">support@socialnews.org</a>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-6 text-sm font-semibold">
        <Link to="/privacy" className="text-secondary hover:text-destructive transition-colors">Privacy Policy →</Link>
        <Link to="/refund-policy" className="text-secondary hover:text-destructive transition-colors">Refund Policy →</Link>
        <Link to="/shipping-policy" className="text-secondary hover:text-destructive transition-colors">Shipping Policy →</Link>
      </div>
    </div>
  );
}
