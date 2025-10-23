export default function PolicyPage() {
  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Privacy Policy
          </h1>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Introduction
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Welcome to our Privacy Policy page. Your privacy is important to us.
            This Privacy Policy outlines the information we collect, how we use
            it, and your rights regarding your personal data.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Information We Collect
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            We may collect the following types of information when you use our
            services:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 mb-4">
            <li>Personal information such as name, email address, etc.</li>
            <li>Usage data (e.g., how you interact with our website or app)</li>
            <li>
              Cookies and tracking technologies to improve user experience
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            We use the collected data for the following purposes:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 mb-4">
            <li>To provide and improve our services</li>
            <li>To communicate with you (e.g., support, notifications)</li>
            <li>To analyze usage patterns and enhance user experience</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Data Sharing
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            We do not sell or rent your personal data to third parties. However,
            we may share your data with:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-600 mb-4">
            <li>
              Third-party service providers for essential services (e.g.,
              payment processing)
            </li>
            <li>Legal authorities when required by law</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Rights
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            You have the right to access, correct, and delete your personal
            data. You can also opt-out of receiving marketing communications at
            any time by following the instructions in the emails we send.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Security
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            We take reasonable precautions to protect your personal data, but
            please be aware that no method of transmission over the internet is
            completely secure.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Changes to This Privacy Policy
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            We may update our Privacy Policy from time to time. Any changes will
            be posted on this page with an updated date.
          </p>

          <p className="text-lg text-gray-600 mb-4">
            If you have any questions about our Privacy Policy, please contact
            us at [your contact information].
          </p>
        </div>
      </div>
    </div>
  );
}
