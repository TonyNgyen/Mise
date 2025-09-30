"use client";

import { useState } from "react";
// Import the updated login action
import { login } from "./actions";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔑 NEW: State for server error message and field highlighting
  const [serverError, setServerError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<
    "email" | "password" | "form" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔑 NEW: Custom submission handler for async actions
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setErrorField(null);
    setIsLoading(true);

    // Create FormData manually from state
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      // 1. Call the server action
      const result = await login(formData);

      if (result && result.error) {
        // 2. Handle the error returned from the server
        setServerError(result.error);
        setIsLoading(false);

        // 3. Highlight inputs based on common login error phrases (usually "Invalid login credentials")
        // Since Supabase often returns a generic error for both, we highlight both fields.
        if (
          result.error.toLowerCase().includes("credentials") ||
          result.error.toLowerCase().includes("invalid")
        ) {
          setErrorField("form"); // We'll highlight the error box, but you could target 'email' or 'password' as well.
        }
      }
      // If successful, the server action calls redirect("/") and this code won't be reached.
    } catch (error) {
      // Handle unexpected client-side or network errors
      console.error("Unexpected login error:", error);
      setServerError("An unexpected error occurred. Please try again.");
      setErrorField("form");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* ... Header Section ... */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Mise
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Your personal meal prep assistant
          </p>
        </div>

        {/* Login Form */}
        {/* 🔑 Change: Attach the custom handler and remove formAction from the button */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // 🔑 Conditional class for email
                className={`appearance-none rounded-t-md relative block w-full px-4 py-3 border 
                    ${
                      serverError &&
                      (errorField === "email" || errorField === "form")
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500 focus:border-red-500 dark:focus:border-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400"
                    }
                    placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // 🔑 Conditional class for password
                className={`appearance-none rounded-b-md relative block w-full px-4 py-3 border 
                    ${
                      serverError &&
                      (errorField === "password" || errorField === "form")
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500 focus:border-red-500 dark:focus:border-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400"
                    }
                    placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
            </div>
          </div>

          {/* 🔑 NEW: Error Display */}
          {serverError && (
            <div
              className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300 text-center"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <div>
            <button
              type="submit" // 🔑 Change: Use type="submit" to trigger the onSubmit handler
              disabled={isLoading}
              // ❌ Remove formAction={login}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              {/* Spinner logic remains the same */}
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
