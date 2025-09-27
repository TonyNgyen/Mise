"use client";

import React, { useEffect, useState } from "react";

function RadialGradient() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="size-18 rounded-full bg-radial-[at_25%_25%] from-white to-zinc-900 to-75% absolute -z-10 blur-3xl"
        style={{
          left: pos.x - 36, // center gradient
          top: pos.y - 36,
        }}
      />
    </div>
  );
}

export default RadialGradient;
