"use client";

import AddInventoryForm from "@/components/add-inventory-form";
import React, { useEffect, useState } from "react";

type Ingredient = { id: string; name: string; brand: string | null };
type Recipe = { id: string; name: string };
type InventoryItem = {
  id: string;
  quantity: number;
  unit: string;
  ingredient?: Ingredient;
  recipe?: Recipe;
  created_at: string;
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch inventory list
  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (data.success) setInventory(data.inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    fetchInventory(); // Refresh the inventory list
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-32"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Inventory
          </h1>
          <button
            onClick={openModal}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Add Item
          </button>
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {inventory.length} item{inventory.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Modal */}
      <AddInventoryForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />

      {/* ✅ Inventory List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Current Inventory
        </h2>

        {inventory.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              📦
            </div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Inventory is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Add ingredients or recipes to get started!
            </p>
            <button
              onClick={openModal}
              className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.ingredient ? (
                        <>
                          <span className="text-2xl">🥕</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.ingredient.name}
                          </span>
                          {item.ingredient.brand && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({item.ingredient.brand})
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">📖</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.recipe?.name}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Added {formatDate(item.created_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {item.quantity}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                      {item.unit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
