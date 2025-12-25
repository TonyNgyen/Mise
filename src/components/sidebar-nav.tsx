"use client";

import React from "react";
import ThemeToggle from "./theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuChefHat,
  LuApple,
  LuBox,
  LuUtensils,
  LuTrophy,
  LuUserRoundCog,
} from "react-icons/lu";

interface SidebarNavProps {
  isAdmin: boolean;
}

export default function SidebarNav({ isAdmin }: SidebarNavProps) {
  const pathname = usePathname();
  console.log(isAdmin);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LuLayoutDashboard },
    { href: "/foodlog", label: "Food Log", icon: LuUtensils },
    { href: "/recipes", label: "Recipes", icon: LuChefHat },
    { href: "/ingredients", label: "Ingredients", icon: LuApple },
    { href: "/inventory", label: "Inventory", icon: LuBox },
    { href: "/goals", label: "Goals", icon: LuTrophy },
    // { href: "/settings", label: "Settings", icon: LuSettings },
  ];

  return (
    <aside className="w-64 h-screen border-r border-r-zinc-200 dark:border-r-zinc-700 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-b-zinc-200 dark:border-b-zinc-700">
        <Link href="/" className="text-xl font-sans font-semibold">
          meap
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#E5F3F5] dark:bg-[#3A8F9E] text-zinc-900 dark:text-white font-medium"
                      : "text-zinc-700 dark:text-white hover:bg-[#E5F3F5] dark:hover:bg-[#3A8F9E] hover:font-medium"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </Link>
              </li>
            );
          })}
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === "/admin"
                    ? "bg-[#E5F3F5] dark:bg-[#3A8F9E] text-zinc-900 dark:text-white font-medium"
                    : "text-zinc-700 dark:text-white hover:bg-[#E5F3F5] dark:hover:bg-[#3A8F9E] hover:font-medium"
                }`}
              >
                <LuUserRoundCog className="w-5 h-5 mr-3" />
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Footer with Theme Toggle */}
      <div className="p-4 border-t border-t-zinc-200 dark:border-t-zinc-700">
        <ThemeToggle />
      </div>
    </aside>
  );
}
