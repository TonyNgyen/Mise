import React from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function TopNav() {
  return (
    <header className="flex justify-between items-center px-96 py-4">
      <Link href="/" className="text-xl font-sans font-medium">
        Alimon
      </Link>
      <div className="flex items-center gap-4">
        {/* <Link href="/login" className="hover:underline">
          Login
        </Link>
        <Link href="/register" className="hover:underline">
          Register
        </Link> */}
        <ThemeToggle />
      </div>
    </header>
  );
}
