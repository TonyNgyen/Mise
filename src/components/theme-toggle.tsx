"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const options = [
    {
      value: "light",
      label: "Light",
    },
    { value: "dark", label: "Dark" },
    {
      value: "system",
      label: "System",
    },
  ];

  return (
    <div className="relative w-fit">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="cursor-pointer appearance-none bg-white dark:bg-[#121212] text-sm text-[#121212] border border-zinc-200 dark:border-zinc-700 dark:text-white font-medium pl-3 pr-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:hover:bg-zinc-800 hover:bg-zinc-100 transition-all duration-200 ease-in-out"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="dark:bg-[#121212] dark:text-white bg-white text-[#121212]"
          >
            {opt.label}
          </option>
        ))}
      </select>

      {/* Current Icon Overlay (non-interactive) */}
      {/* <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-400">
        {options.find((opt) => opt.value === theme)?.icon}
      </div> */}
    </div>
  );
};

export default ThemeToggle;
