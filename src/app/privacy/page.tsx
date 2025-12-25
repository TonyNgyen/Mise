import React from "react";

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Last Updated: {process.env.LAUNCH_DATE_STRING}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8">
            Welcome to meap. We respect your privacy and are committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, and safeguard your data when you use our meal
            prep assistant and nutrition tracker service.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
              Account Information
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              When you create an account with meap, we collect:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Password (encrypted and securely stored)</li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Meal and Nutrition Data
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              To provide our meal prep and nutrition tracking services, we
              collect and store:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-6">
              <li>Meal plans you create</li>
              <li>Foods and recipes you track</li>
              <li>Nutritional information you input</li>
              <li>Dietary preferences and goals you set</li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Contact Form Information
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              When you contact us through our website, we collect:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Message content</li>
              <li>Subject/reason for contact</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              We use your information solely to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-6">
              <li>Provide and maintain the meap service</li>
              <li>Create and manage your account</li>
              <li>Store your meal plans and nutrition tracking data</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Improve our service based on user feedback</li>
              <li>
                Send important service-related notifications (e.g., account
                updates, security alerts)
              </li>
            </ul>

            <p className="text-zinc-900 dark:text-zinc-100 font-semibold mb-2">
              We do not:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2">
              <li>Send marketing emails or newsletters</li>
              <li>Use your data for advertising</li>
              <li>Track your activity with analytics tools</li>
              <li>Share your information with third parties</li>
              <li>Sell your personal information</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Data Storage and Security
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              Your data is stored securely on our servers located in the United
              States. We implement industry-standard security measures to
              protect your information, including:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>Encryption of sensitive data</li>
              <li>Secure password storage</li>
              <li>Regular security updates</li>
              <li>Access controls and monitoring</li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              While we take reasonable precautions to protect your data, no
              method of transmission over the internet is 100% secure. We cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Your Data Rights
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>
                <strong>Access</strong> your personal information at any time
                through your account
              </li>
              <li>
                <strong>Update</strong> or correct your information
              </li>
              <li>
                <strong>Delete</strong> your account and associated data
              </li>
              <li>
                <strong>Export</strong> your data (upon request)
              </li>
              <li>
                <strong>Object</strong> to processing of your personal
                information
              </li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:tonynguyeenn@gmail.com"
                className="text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
              >
                tonynguyeenn@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Data Retention
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We retain your personal information for as long as your account is
              active. If you delete your account, we will delete your personal
              information within 30 days, except where we are required to retain
              it for legal or regulatory purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Children's Privacy
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              meap is not intended for use by children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected information from a
              child under 13, we will delete it promptly.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We do not use cookies or tracking technologies on our website. We
              do not track your activity across other websites or services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Third-Party Services
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We do not share your personal information with third-party
              services, analytics providers, or advertising networks. Your data
              remains private and is used only to provide the meap service to
              you.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date at the top</li>
              <li>
                Sending you an email notification for significant changes (if
                you have an account)
              </li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              Your continued use of meap after any changes indicates your
              acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Contact Us
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or how we handle your personal information, please
              contact us at:
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:tonynguyeenn@gmail.com"
                className="text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
              >
                tonynguyeenn@gmail.com
              </a>
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">
              We will respond to your inquiry within 30 days.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Legal Compliance
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              This Privacy Policy is designed to comply with United States
              privacy laws. We are committed to protecting your privacy and
              handling your data responsibly in accordance with applicable
              regulations.
            </p>
          </section>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-12">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
              By using meap, you acknowledge that you have read and understood
              this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
