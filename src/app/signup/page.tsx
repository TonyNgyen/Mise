"use client";

import { useState } from "react";
import { signup } from "../login/actions";
import Link from "next/link";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorField, setErrorField] = useState<string | null>(null);

  // 1. Create the submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setErrorField(null); // Clear previous error field
    setIsLoading(true);

    // ... (FormData creation and client-side username validation) ...
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("username", username.trim());
    formData.append("email", email);
    formData.append("password", password);

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    const trimmedUsername = username.trim();

    if (!usernameRegex.test(trimmedUsername)) {
      setIsLoading(false);
      setServerError(
        "Username can only contain letters (a-z), numbers (0-9), underscores (_), and periods (.)."
      );
      setErrorField("username");
      return;
    }
    // --- End Username Validation ---

    try {
      const result = await signup(formData);

      if (result && result.error) {
        const lowerCaseError = result.error.toLowerCase();
        setServerError(result.error);
        setIsLoading(false);

        // 🔑 UPDATED: Logic to identify which field caused the error
        if (
          lowerCaseError.includes("password") ||
          lowerCaseError.includes("length") ||
          lowerCaseError.includes("weak")
        ) {
          setErrorField("password");
        } else if (lowerCaseError.includes("please use a different email")) {
          setErrorField("email");
        } else if (lowerCaseError.includes("please use a different username")) {
          setErrorField("username");
        } else {
          setErrorField("form"); // Default to a general form error
        }
      }
    } catch (error) {
      // 🛑 FIX: Filter the NEXT_REDIRECT error 🛑
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        // Re-throw the error so Next.js can properly handle the redirect
        throw error;
      }

      // Handle all other unexpected client-side or network errors
      console.error("Unexpected signup error:", error);
      setServerError("An unexpected error occurred. Please try again.");
      setErrorField("form");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-8 flex-1 bg-[#F7F9FA] dark:bg-zinc-900">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 font-sans font-medium">
            Join meap and simplify your meal prep
          </p>
        </div>

        {/* Signup Form */}
        {/* 4. Attach the handleSubmit handler */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700"
        >
          <div className="space-y-4">
            {/* Name Row and other inputs are the same */}
            {/* ... Your input fields (First Name, Last Name, Email, Username, Password) ... */}

            {/* ERROR DISPLAY AREA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  First Name
                </label>

                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="relative block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 placeholder-zinc-500 dark:placeholder-zinc-400 text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                  placeholder="First Name"
                />
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Last Name
                </label>

                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="relative block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 placeholder-zinc-500 dark:placeholder-zinc-400 text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent transition-all duration-200"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email Input */}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
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
                className={`relative block w-full px-4 py-3 border 
            ${
              serverError && errorField === "email"
                ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-600 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all duration-200"
            }
            placeholder-zinc-500 dark:placeholder-zinc-400 text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent`}
                placeholder="Email address"
              />
            </div>

            {/* Username Input */}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // 🔑 UPDATED: Conditional class for red border
                className={`relative block w-full px-4 py-3 border 
            ${
              serverError && errorField === "username"
                ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-600 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all duration-200"
            }
            placeholder-zinc-500 dark:placeholder-zinc-400 text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent`}
                placeholder="Username"
              />
            </div>

            {/* Password Input */}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`relative block w-full px-4 py-3 border 
            ${
              serverError && errorField === "password"
                ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-600 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all duration-200"
            }
            placeholder-zinc-500 dark:placeholder-zinc-400 text-zinc-900 dark:text-white bg-white dark:bg-zinc-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent`}
                placeholder="Password"
              />
            </div>
            {serverError && (
              <div
                className="text-center p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-300"
                role="alert"
              >
                {/* <span className="font-medium">Sign up failed:</span>{" "} */}
                {serverError}
              </div>
            )}
          </div>

          <div>
            {/* 5. Change formAction to type="submit" */}
            <button
              type="submit"
              disabled={isLoading}
              className=" cursor-pointer group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#3A8F9E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {/* ... Loading/Sign up button content ... */}
              {isLoading ? (
                <>
                  {/* Spinner SVG */}
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Creating account...
                </>
              ) : (
                <>
                  <span>Sign up</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* ... Existing Sign in link ... */}
          <div className="text-center pt-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
