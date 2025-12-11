"use client";
import Link from "next/link";
import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
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
    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
      <span className="text-zinc-900 dark:text-white">{name}</span>
      <span className={`text-sm font-bold ${statusColors["good"]}`}>
        {quantity}
      </span>
    </div>
  );
}

// Skeleton component for loading state
function InventoryItemSkeleton() {
  return (
    <div className="flex justify-between items-center py-2 animate-pulse">
      <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3"></div>
      <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-16"></div>
    </div>
  );
}

function EmptyInventoryState() {
  return (
    <div className="text-center">
      <div className="text-zinc-400 dark:text-zinc-500 mb-4">
        <LuBox className="w-14 h-14 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
        Your inventory is empty
      </h3>
      <p className="text-zinc-500 dark:text-zinc-400 mb-4 font-medium">
        Add items to track your inventory
      </p>
      <Link href="/inventory">
        <button className="px-4 py-2 bg-[#3A8F9E] text-white rounded-md hover:bg-[#337E8D] transition-colors cursor-pointer">
          Add Item
        </button>
      </Link>
    </div>
  );
}

type InventoryCardProps = { inventoryItems?: InventoryItemType[] };

const InventoryCard = forwardRef<
  { refresh: () => Promise<void> },
  InventoryCardProps
>(({ inventoryItems: initialInventoryItems = [] }, ref) => {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with prop data
  useEffect(() => {
    setInventoryItems(initialInventoryItems);
  }, [initialInventoryItems]);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (data.success) {
        setInventoryItems(data.inventory);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Inventory Status
        </h2>
        {/* <span className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
          3 items low
        </span> */}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <InventoryItemSkeleton />
          <InventoryItemSkeleton />
          <InventoryItemSkeleton />
          <InventoryItemSkeleton />
        </div>
      ) : inventoryItems.length === 0 ? (
        <EmptyInventoryState />
      ) : (
        <div className="space-y-2">
          {inventoryItems.map((item) => (
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
});

InventoryCard.displayName = "InventoryCard";

export default InventoryCard;
