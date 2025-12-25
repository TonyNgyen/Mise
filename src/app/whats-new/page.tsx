import React from "react";

interface Update {
  version: string;
  date: string;
  title: string;
  isLaunch?: boolean;
  description?: string;
  features?: string[];
  improvements?: string[];
  fixes?: string[];
  note?: string;
}

function WhatsNewPage() {
  const updates: Update[] = [
    {
      version: "1.0.0",
      date: process.env.LAUNCH_DATE_STRING || "2025-12-21",
      title: "Welcome to meap!",
      isLaunch: true,
      description:
        "We're excited to launch the first version of meap, your meal prep assistant and nutrition tracker.",
      features: [
        "Create and save custom recipes",
        "Add ingredients to your personal database",
        "Track your daily nutrition and calories",
        "Manage your ingredient and recipe inventory",
        "Share recipes with the community (pending approval)",
        "Set dietary goals and preferences",
      ],
      note: "This is just the beginning! We're actively developing new features and would love to hear your feedback.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            What&apos;s New
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-200 max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and changes
            to meap.
          </p>
        </div>
      </div>

      {/* Updates Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {updates.map((update, index) => (
            <div key={index} className="relative">
              {/* Version Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#3A8F9E] text-white font-medium">
                  Version {update.version}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-200">
                  {update.date}
                </span>
              </div>

              {/* Update Card */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 border border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                  {update.title}
                </h2>

                {update.description && (
                  <p className="text-lg text-zinc-700 dark:text-zinc-200 mb-6">
                    {update.description}
                  </p>
                )}

                {update.features && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-3 uppercase tracking-wide">
                      What you can do:
                    </h3>
                    <div className="space-y-3">
                      {update.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <span className="text-zinc-900 dark:text-zinc-200 mt-0.5">
                            ✨
                          </span>
                          <span className="text-zinc-700 dark:text-zinc-200">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {update.improvements && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-3 uppercase tracking-wide">
                      Improvements:
                    </h3>
                    <div className="space-y-3">
                      {update.improvements.map(
                        (improvement, improvementIndex) => (
                          <div
                            key={improvementIndex}
                            className="flex items-start gap-3"
                          >
                            <span className="text-zinc-900 dark:text-zinc-200 mt-0.5">
                              🔧
                            </span>
                            <span className="text-zinc-700 dark:text-zinc-200">
                              {improvement}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {update.fixes && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-3 uppercase tracking-wide">
                      Bug Fixes:
                    </h3>
                    <div className="space-y-3">
                      {update.fixes.map((fix, fixIndex) => (
                        <div key={fixIndex} className="flex items-start gap-3">
                          <span className="text-zinc-900 dark:text-zinc-200 mt-0.5">
                            🐛
                          </span>
                          <span className="text-zinc-700 dark:text-zinc-200">
                            {fix}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {update.note && (
                  <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                    <p className="text-zinc-700 dark:text-zinc-200">
                      {update.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Call to Action for Launch */}
              {update.isLaunch && (
                <div className="mt-6 bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
                  <p className="text-zinc-700 dark:text-zinc-200 mb-4">
                    Have suggestions or found a bug? We&apos;d love to hear from you!
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-2.5 bg-[#3A8F9E] text-white font-medium rounded-lg hover:bg-[#337E8D] transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Future Updates Notice */}
        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Check back here for future updates and new features!
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhatsNewPage;
