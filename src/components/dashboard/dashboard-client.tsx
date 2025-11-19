"use client";

import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import NutrientOverview from "./nutrient-overview";
import RecentMealsCard from "./recent-meals-card";
import InventoryCard from "./inventory-card";
import { LuUtensils, LuBookOpen, LuCarrot, LuBoxes } from "react-icons/lu";
import Link from "next/link";

type NutrientOverviewHandle = {
  refresh: () => Promise<void>;
};

type RecentMealsHandle = {
  refresh: () => Promise<void>;
};

type InventoryHandle = {
  refresh: () => Promise<void>;
};

type DashboardClientProps = {
  userData: any;
  initialRecentMeals: any[];
  initialInventoryItems: any[];
};

export default function DashboardClient({
  userData,
  initialRecentMeals,
  initialInventoryItems,
}: DashboardClientProps) {
  const [recentMeals, setRecentMeals] = useState(initialRecentMeals);
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);

  const nutrientOverviewRef = useRef<NutrientOverviewHandle>(null);
  const recentMealsRef = useRef<RecentMealsHandle>(null);
  const inventoryRef = useRef<InventoryHandle>(null);

  const handleLogSuccess = async () => {
    nutrientOverviewRef.current?.refresh();
    await refreshRecentMeals();
    await refreshInventory();
  };

  const refreshRecentMeals = async () => {
    console.log("Refreshing recent meals...");
    try {
      const res = await fetch("/api/recent-meals");
      const data = await res.json();
      if (data.success) {
        setRecentMeals(data.meals);
      }
    } catch (error) {
      console.error("Error fetching recent meals:", error);
    }
  };

  const refreshInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (data.success) {
        setInventoryItems(data.inventory);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userData?.first_name || "Chef"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your overview for today
          </p>
        </div>
      </div>

      {/* Nutrition Overview - pass callback for refresh */}
      <NutrientOverview
        ref={nutrientOverviewRef}
        onLogSuccess={handleLogSuccess}
      />

      {/* Quick Actions */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <QuickAction
          icon={<LuUtensils className="w-7 h-7" />}
          title="Log Food"
          href="/foodlog"
        />
        <QuickAction
          icon={<LuBookOpen className="w-7 h-7" />}
          title="Recipes"
          href="/recipes"
        />
        <QuickAction
          icon={<LuCarrot className="w-7 h-7" />}
          title="Ingredients"
          href="/ingredients"
        />
        <QuickAction
          icon={<LuBoxes className="w-7 h-7" />}
          title="Inventory"
          href="/inventory"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        <RecentMealsCard ref={recentMealsRef} recentMeals={recentMeals} />
        <InventoryCard ref={inventoryRef} inventoryItems={inventoryItems} />
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 rounded-xl text-center transition-colors transform hover:scale-105"
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="font-medium">{title}</div>
    </Link>
  );
}
