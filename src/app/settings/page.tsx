"use client";

import React, { useState } from "react";
import { IconType } from "react-icons";
import { LuUser, LuKey, LuSlidersHorizontal } from "react-icons/lu";

// --- Types ---
type SettingKeys = "profile" | "security" | "preferences";

interface SettingItem {
  name: string;
  icon: IconType;
  component: React.FC;
}

// --- Section Components ---
const ProfileSettings: React.FC = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
      Profile Settings
    </h2>
    <p className="text-zinc-600 dark:text-zinc-400">Manage your profile.</p>
  </div>
);

const SecuritySettings: React.FC = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
      Security Settings
    </h2>
    <p className="text-zinc-600 dark:text-zinc-400">
      Change your password or enable 2FA.
    </p>
  </div>
);

const PreferencesSettings: React.FC = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
      Preferences Settings
    </h2>
    <p className="text-zinc-600 dark:text-zinc-400">Manage your preferences.</p>
  </div>
);

// --- Main Page Component ---
export default function Page() {
  const [activeTab, setActiveTab] = useState<SettingKeys>("profile");

  const settingsSections: Record<SettingKeys, SettingItem> = {
    profile: { name: "Profile", icon: LuUser, component: ProfileSettings },
    security: { name: "Security", icon: LuKey, component: SecuritySettings },
    preferences: {
      name: "Preferences",
      icon: LuSlidersHorizontal,
      component: PreferencesSettings,
    },
  };

  const ActiveComponent = settingsSections[activeTab].component;

  // --- Sidebar ---
  const Sidebar = () => (
    <nav className="flex flex-col p-6 space-y-2 w-64 border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
      <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">
        Settings
      </h3>
      {Object.entries(settingsSections).map(([key, { name, icon: Icon }]) => {
        const typedKey = key as SettingKeys;
        const isActive = activeTab === typedKey;
        return (
          <button
            key={typedKey}
            onClick={() => setActiveTab(typedKey)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-medium cursor-pointer
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
              }`}
          >
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </button>
        );
      })}
    </nav>
  );

  // --- Main Content ---
  const MainContent = () => (
    <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900 p-6">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 transition-colors duration-200">
        <ActiveComponent />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-zinc-100 dark:bg-zinc-900 transition-colors duration-300">
      <Sidebar />
      <MainContent />
    </div>
  );
}