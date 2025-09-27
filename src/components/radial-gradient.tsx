// "use client";

// import React, { useEffect, useState } from "react";

// function RadialGradient() {
//   const [pos, setPos] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setPos({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);
//   return (
//     <div className="absolute inset-0 -z-10">
//       <div
//         className="size-18 rounded-full bg-radial-[at_25%_25%] from-white to-zinc-900 to-75% absolute -z-10 blur-3xl"
//         style={{
//           left: pos.x - 36, // center gradient
//           top: pos.y - 36,
//         }}
//       />
//     </div>
//   );
// }

// export default RadialGradient;

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
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Light mode gradient */}
      <div
        className="absolute rounded-full blur-2xl pointer-events-none dark:hidden"
        style={{
          left: pos.x - 128,
          top: pos.y - 128,
          width: 256,
          height: 256,
          backgroundImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0) 70%)",
          transform: "translateZ(0)",
          willChange: "transform, left, top",
        }}
      />

      {/* Dark mode gradient */}
      <div
        className="absolute rounded-full blur-2xl pointer-events-none hidden dark:block"
        style={{
          left: pos.x - 128,
          top: pos.y - 128,
          width: 256,
          height: 256,
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(24,24,27,0.01) 100%)",
          transform: "translateZ(0)",
          willChange: "transform, left, top",
        }}
      />
    </div>
  );
}

export default RadialGradient;
