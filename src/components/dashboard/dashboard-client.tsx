"use client";
import { useState, useRef } from "react";
import NutrientOverview from "./nutrient-overview";
import RecentMealsCard from "./recent-meals-card";
import InventoryCard from "./inventory-card";
import { LuUtensils, LuBookOpen, LuCarrot, LuBoxes } from "react-icons/lu";
import Link from "next/link";
import AddLogModal from "../add-log-modal";
import AddInventoryModal from "../add-inventory-modal"; // Import the inventory modal
import { logout } from "@/app/logout/actions";

type NutrientOverviewHandle = {
  refresh: () => Promise<void>;
};
type RecentMealsHandle = {
  refresh: () => Promise<void>;
};
type InventoryHandle = {
  refresh: () => Promise<void>;
};
interface UserData {
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
type FoodLogNutrient = {
  nutrient_key: string;
  amount: number;
};
type recentMeals = Array<{
  id: string;
  log_datetime: string;
  ingredient: { name: string } | null;
  recipe: { name: string } | null;
  nutrients: FoodLogNutrient[] | null;
}> | null;
type InventoryItemType = {
  id: string;
  ingredient?: {
    name: string;
  };
  recipe?: {
    name: string;
  };
  quantity: number;
  unit: string;
};
type DashboardClientProps = {
  userData: UserData | null;
  initialRecentMeals: recentMeals | null;
  initialInventoryItems?: InventoryItemType[];
};

export default function DashboardClient({
  userData,
  initialRecentMeals,
  initialInventoryItems,
}: DashboardClientProps) {
  const [recentMeals, setRecentMeals] = useState(initialRecentMeals);
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const nutrientOverviewRef = useRef<NutrientOverviewHandle>(null);
  const recentMealsRef = useRef<RecentMealsHandle>(null);
  const inventoryRef = useRef<InventoryHandle>(null);

  const handleLogSuccess = async () => {
    nutrientOverviewRef.current?.refresh();
    await refreshRecentMeals();
    await refreshInventory();
  };

  const handleInventorySuccess = async () => {
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
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Welcome back, {userData?.first_name || "Chef"}
          </h1>
          <p className="font-semibold text-zinc-600 dark:text-zinc-400">
            Here&apos;s your overview for today
          </p>
        </div>
        <button
          onClick={logout}
          className="hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer px-4 py-2 rounded-md transition-all"
        >
          Log out
        </button>
      </div>

      {/* Nutrition Overview - pass callback for refresh */}
      <NutrientOverview
        ref={nutrientOverviewRef}
        onLogSuccess={handleLogSuccess}
      />

      {/* Quick Actions */}
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Log Food Button - opens modal */}
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="hover:shadow-[#C9E6EA] hover:border-[#C9E6EA]  text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 rounded-xl text-center transition-colors transform hover:scale-105 cursor-pointer"
        >
          <div className="flex justify-center mb-3">
            <LuUtensils className="w-7 h-7" />
          </div>
          <div className="font-medium">Log Food</div>
        </button>
        <button
          onClick={() => setIsInventoryModalOpen(true)}
          className="hover:shadow-[#C9E6EA] hover:border-[#C9E6EA] text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 rounded-xl text-center transition-colors transform hover:scale-105 cursor-pointer"
        >
          <div className="flex justify-center mb-3">
            <LuBoxes className="w-7 h-7" />
          </div>
          <div className="font-medium">Add Inventory</div>
        </button>
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
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        <RecentMealsCard ref={recentMealsRef} recentMeals={recentMeals} />
        <InventoryCard ref={inventoryRef} inventoryItems={inventoryItems} />
      </div>

      {/* Add Log Modal */}
      <AddLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        selectedDate={new Date().toISOString().split("T")[0]}
        onLogSuccess={handleLogSuccess}
      />

      {/* Add Inventory Modal */}
      <AddInventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onSuccess={handleInventorySuccess}
      />
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
      className="hover:border-[#C9E6EA] text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 rounded-xl text-center transition-colors transform hover:scale-105 hover:shadow-[#C9E6EA] cursor-pointer"
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="font-medium">{title}</div>
    </Link>
  );
}
