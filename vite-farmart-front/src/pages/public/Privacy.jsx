import React from "react";


function PrivacyAndTerms() {
  return (
    <PublicLayout>
      <div className="page privacy-terms-page">
            
        {}
        <section className="privacy-section">
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-subtitle">
            Your privacy is important to us. This section explains how we collect, use, and protect your information.
          </p>

          <h2 className="section-title">Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, and account details
            when you register or interact with our services.
          </p>

          <h2 className="section-title">How We Use Your Information</h2>
          <p>
            Your information is used to provide and improve our services, communicate with you, process transactions,
            and personalize your experience on Farmart.
          </p>

          <h2 className="section-title">Data Protection</h2>
          <p>
            We implement industry-standard measures to protect your data from unauthorized access, disclosure, or
            modification. Your personal information is stored securely and only accessible by authorized personnel.
          </p>

          <h2 className="section-title">Cookies and Tracking</h2>
          <p>
            We may use cookies and similar tracking technologies to enhance your experience on our site, analyze
            trends, and gather demographic information.
          </p>
        </section>

        {}
        <section className="terms-section">
          <h1 className="page-title">Terms & Conditions</h1>
          <p className="page-subtitle">
            By using Farmart, you agree to the following terms and conditions:
          </p>

          <h2 className="section-title">User Responsibilities</h2>
          <p>
            Users must provide accurate information when registering and must not engage in illegal or harmful activities
            while using our platform.
          </p>

          <h2 className="section-title">Product Listings and Transactions</h2>
          <p>
            Farmart is a marketplace platform. We are not responsible for the quality, safety, or legality of products
            sold by users. Buyers and sellers are responsible for their transactions.
          </p>

          <h2 className="section-title">Account Security</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account credentials. Any activity from
            your account is your responsibility.
          </p>

          <h2 className="section-title">Limitation of Liability</h2>
          <p>
            Farmart is not liable for any damages, losses, or disputes between users or arising from the use of our
            platform.
          </p>

          <h2 className="section-title">Changes to Terms</h2>
          <p>
            We may update these Terms & Conditions from time to time. Changes will be posted on this page with the updated
            date.
          </p>

          <h2 className="section-title">Contact Us</h2>
          <p>
            For questions regarding Privacy or Terms, contact us at{" "}
            <a href="mailto:info@farmart.com">info@farmart.com</a>.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}

export default PrivacyAndTerms;
