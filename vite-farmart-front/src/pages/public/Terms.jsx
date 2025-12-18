export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Terms & Conditions
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Welcome to FarMart. These terms and conditions outline the rules and
                regulations for the use of FarMart's Website and Services.
              </p>
              <p className="text-gray-700">
                By accessing this website, we assume you accept these terms and
                conditions. Do not continue to use FarMart if you do not agree to all
                of the terms and conditions stated on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. User Accounts
              </h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide accurate,
                complete, and current information at all times. Failure to do so
                constitutes a breach of the Terms.
              </p>
              <p className="text-gray-700">
                You are responsible for safeguarding the password that you use to
                access the Service and for any activities or actions under your
                password.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Products and Services
              </h2>
              <p className="text-gray-700 mb-4">
                All products and services are subject to availability. We reserve the
                right to discontinue any product or service at any time.
              </p>
              <p className="text-gray-700">
                Prices for our products are subject to change without notice. We
                reserve the right to modify or discontinue the Service without notice
                at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Orders and Payments
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to refuse any order you place with us. We may, in
                our sole discretion, limit or cancel quantities purchased per person,
                per household, or per order.
              </p>
              <p className="text-gray-700">
                All payments must be made through our approved payment methods. You
                agree to provide current, complete, and accurate purchase and account
                information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Farmer Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">
                Farmers using our platform agree to provide accurate product
                information, maintain product quality, and fulfill orders in a timely
                manner.
              </p>
              <p className="text-gray-700">
                Farmers are responsible for ensuring their products meet all relevant
                health and safety standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                In no event shall FarMart, nor its directors, employees, partners,
                agents, suppliers, or affiliates, be liable for any indirect,
                incidental, special, consequential, or punitive damages, including
                without limitation, loss of profits, data, use, goodwill, or other
                intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace
                these Terms at any time. We will provide notice of any significant
                changes by posting the new Terms on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                <li>Email: support@farmart.com</li>
                <li>Phone: +254 700 000 000</li>
              </ul>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
