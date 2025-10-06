"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LuBox } from "react-icons/lu";

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

function InventoryItem({
  name,
  quantity,
}: {
  name: string;
  quantity: string;
  status?: string;
}) {
  const statusColors = {
    low: "text-red-600 dark:text-red-400",
    medium: "text-amber-600 dark:text-amber-400",
    good: "text-green-600 dark:text-green-400",
  };

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-900 dark:text-white">{name}</span>
      <span className={`text-sm font-medium ${statusColors["good"]}`}>
        {quantity}
      </span>
    </div>
  );
}

function EmptyInventoryState() {
  return (
    <div className="text-center">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        <LuBox className="w-14 h-14 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Your inventory is empty
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Add ingredients or recipes to track your inventory
      </p>
      <Link href="/inventory">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
          Add Item
        </button>
      </Link>
    </div>
  );
}

function InventoryCard() {
  const [inventory, setInventory] = useState<InventoryItemType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (data.success) {
        setInventory(data.inventory);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Inventory Status
        </h2>
        {/* <span className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
          3 items low
        </span> */}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Loading inventory...
          </p>
        </div>
      ) : inventory.length === 0 ? (
        <EmptyInventoryState />
      ) : (
        <div className="space-y-2">
          {inventory.map((item) => (
            <InventoryItem
              key={item.id}
              name={item.ingredient?.name || item.recipe?.name || ""}
              quantity={`${item.quantity} ${item.unit}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default InventoryCard;
