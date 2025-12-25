import React from "react";

function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Terms of Service
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
            Welcome to meap! These Terms of Service ("Terms") govern your use of
            the meap meal prep assistant and nutrition tracker service
            ("Service"). By creating an account or using meap, you agree to
            these Terms. If you don't agree, please don't use our Service.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              By accessing or using meap, you confirm that:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>You are at least 13 years of age</li>
              <li>
                You have read, understood, and agree to be bound by these Terms
              </li>
              <li>You comply with all applicable laws and regulations</li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              If you are under 18, you must have permission from a parent or
              guardian to use meap.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              2. Description of Service
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              meap is a free meal prep assistant and nutrition tracking platform
              that allows you to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>Create and manage recipes</li>
              <li>Add and track ingredients</li>
              <li>Monitor your nutrition and calorie intake</li>
              <li>Track your ingredient and recipe inventory</li>
              <li>Share recipes publicly (subject to review and approval)</li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              meap is currently in active development. Features may be added,
              modified, or removed at any time as we continue to improve the
              Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              3. Account Registration and Security
            </h2>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
              Account Creation
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              To use meap, you must create an account by providing accurate and
              complete information, including your name, email address, and
              password.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Account Security
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              We are not liable for any loss or damage arising from your failure
              to protect your account credentials.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Account Termination
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              You may delete your account at any time through your account
              settings. We reserve the right to suspend or terminate your
              account if you violate these Terms or engage in prohibited
              activities.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              4. User Content and Ownership
            </h2>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
              Your Content
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              You retain ownership of the content you create on meap, including:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-6">
              <li>Private recipes and meal plans</li>
              <li>Personal nutrition logs and tracking data</li>
              <li>Private inventory records</li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Public Content License
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              When you choose to make recipes or ingredients public, you grant
              meap a worldwide, non-exclusive, royalty-free license to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>Display and distribute your content to other users</li>
              <li>Use your content to improve and enhance the Service</li>
              <li>
                Moderate, review, and approve content before public release
              </li>
              <li>Remove content that violates these Terms</li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              You can remove your public content at any time, but copies may
              remain in backups for a reasonable period.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Ingredient Database
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              When you add ingredients to our database (such as "Kraft American
              Cheese Slices" or other branded products), you acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-6">
              <li>Nutritional facts and brand names are factual information</li>
              <li>This information may be used by other meap users</li>
              <li>
                We may verify, edit, or remove ingredient information to ensure
                accuracy
              </li>
              <li>
                All ingredient submissions are subject to review and approval
                before being made publicly available
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Content Review Process
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              All recipes and ingredients marked for public sharing are subject
              to review and approval by meap before being released to other
              users. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>Approve or reject any content submission</li>
              <li>Request modifications before approval</li>
              <li>
                Remove previously approved content if it violates these Terms
              </li>
              <li>
                Determine the timeline for review (we aim to review within a
                reasonable timeframe)
              </li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Content that is not approved for public sharing will remain
              visible only to you.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Third-Party Content
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              meap may include nutritional data and ingredient information from
              third-party databases (such as the USDA) to pre-populate our
              ingredient database. This content is provided for informational
              purposes and may not always be completely accurate or up-to-date.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              5. Prohibited Activities
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Impersonate others or provide false information</li>
              <li>Upload harmful, offensive, or inappropriate content</li>
              <li>
                Submit recipes or ingredients containing dangerous, harmful, or
                misleading information
              </li>
              <li>
                Attempt to hack, disrupt, or compromise the security of the
                Service
              </li>
              <li>Use automated tools (bots, scrapers) without permission</li>
              <li>Spam or harass other users</li>
              <li>Violate the intellectual property rights of others</li>
              <li>
                Use the Service for any commercial purpose without our consent
              </li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              Violation of these prohibitions may result in immediate account
              termination.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              6. Disclaimers and Limitations of Liability
            </h2>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
              Not Medical Advice
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              <strong className="text-zinc-900 dark:text-zinc-100">
                IMPORTANT:
              </strong>{" "}
              meap is a tool for tracking meals and nutrition. It does not
              provide medical, nutritional, or dietary advice. The Service is
              for informational purposes only and should not be considered
              professional medical advice.
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Always consult with a qualified healthcare provider or registered
              dietitian before making significant dietary changes or if you have
              specific health concerns.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Nutritional Information
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              While we strive for accuracy, nutritional information on meap may
              contain errors or may be incomplete. We rely on user-submitted
              data and third-party databases, which may not always be accurate.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              User-Generated Content
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              meap is not responsible for the accuracy, safety, or legality of
              user-generated recipes and ingredients. Users create recipes at
              their own risk, and you should use your own judgment before
              following any recipe or dietary information on the platform.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              No Warranties
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              The Service is provided "as is" and "as available" without
              warranties of any kind, either express or implied, including but
              not limited to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-6">
              <li>
                Warranties of merchantability or fitness for a particular
                purpose
              </li>
              <li>
                Warranties that the Service will be uninterrupted, error-free,
                or secure
              </li>
              <li>
                Warranties regarding the accuracy or reliability of content
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Limitation of Liability
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              To the fullest extent permitted by law, meap and its owners,
              employees, and affiliates shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>
                Any indirect, incidental, special, consequential, or punitive
                damages
              </li>
              <li>Loss of profits, data, or goodwill</li>
              <li>
                Personal injury or property damage resulting from your use of
                the Service
              </li>
              <li>Errors, mistakes, or inaccuracies in content</li>
              <li>Unauthorized access to your account or data</li>
              <li>Any damages arising from user-generated content</li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              Our total liability to you for any claims arising from your use of
              meap shall not exceed $100 or the amount you paid us in the last
              12 months (currently $0 as the Service is free).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              7. Indemnification
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              You agree to indemnify, defend, and hold harmless meap and its
              owners, employees, and affiliates from any claims, damages,
              losses, liabilities, and expenses (including legal fees) arising
              from:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Content you submit to the Service</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              8. Changes to the Service
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              meap is in active development. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>
                Modify, suspend, or discontinue any feature or the entire
                Service at any time
              </li>
              <li>Change these Terms at any time by posting updated Terms</li>
              <li>
                Require you to accept updated Terms to continue using the
                Service
              </li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              We will notify you of significant changes via email or through the
              Service. Your continued use after changes indicates acceptance of
              the new Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              9. Future Paid Features
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              While meap is currently free, we may introduce paid features,
              subscriptions, or premium plans in the future. If we do:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2">
              <li>We will provide advance notice</li>
              <li>
                Free features available at the time may remain free or become
                paid
              </li>
              <li>Separate terms and pricing will be clearly communicated</li>
              <li>Refund policies will be established for any paid features</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              10. Termination
            </h2>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
              By You
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              You may stop using meap and delete your account at any time.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              By Us
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              We may suspend or terminate your account immediately if you:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 space-y-2 mb-4">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Submit harmful, dangerous, or misleading content</li>
              <li>Abuse or harm other users</li>
              <li>Compromise the security of the Service</li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              Upon termination, your right to use the Service immediately
              ceases, and we may delete your account and data in accordance with
              our Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              11. Governing Law and Disputes
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              These Terms are governed by the laws of the State of California,
              United States, without regard to its conflict of law provisions.
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">
              Any disputes arising from these Terms or your use of meap shall be
              resolved in the state or federal courts located in California. You
              consent to the personal jurisdiction of these courts.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              12. Miscellaneous
            </h2>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">
              Entire Agreement
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              These Terms, together with our Privacy Policy, constitute the
              entire agreement between you and meap regarding the Service.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Severability
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              If any provision of these Terms is found to be invalid or
              unenforceable, the remaining provisions will continue in full
              force and effect.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Waiver
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Assignment
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">
              You may not assign or transfer these Terms or your account to
              anyone else. We may assign our rights and obligations under these
              Terms without restriction.
            </p>

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Contact Information
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:tonynguyeenn@gmail.com"
                className="text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
              >
                tonynguyeenn@gmail.com
              </a>
            </p>
          </section>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-12">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
              By using meap, you acknowledge that you have read, understood, and
              agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfServicePage;
