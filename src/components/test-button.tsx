"use client";

import React from "react";

export default function TestButton() {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "vitamin_c",
          display_name: "Vitamin C",
          unit: "mg",
        }),
      });

      const data = await res.json();
      console.log("Response:", data);
    } catch (err) {
      console.error("Error testing insert:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Test Insert
    </button>
  );
}
