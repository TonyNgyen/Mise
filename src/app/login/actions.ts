"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

type SignupResult = {
  error: string | null;
};

type LoginResult = { error: string } | void;

export async function login(formData: FormData): Promise<LoginResult> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // 🔑 Change: Instead of redirecting on error, return the error object.
    // Supabase error messages are usually good enough for login failure (e.g., "Invalid login credentials").
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData): Promise<SignupResult> {
  const supabase = await createClient();

  // Extract fields from form (Keep the extraction logic)
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const username = formData.get("username") as string;

  const normalizedUsername = username.toLowerCase().trim();

  const { data: existingUsername } = await supabase
    .from("profiles")
    .select("username")
    .filter("username", "ilike", normalizedUsername)
    .single();

  if (existingUsername) {
    return { error: "Please use a different username." };
  }

  // Call Supabase signup with metadata
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        username: username,
      },
    },
  });

  if (error) {
    // console.error("Signup error:", error);
    if (error.code == "weak_password") {
      return { error: "Password must be at least 6 characters long." };
    } else if (error.code == "user_already_exists") {
      return { error: "Please use a different email address." };
    }
    // ❌ DO NOT redirect here on validation/auth error
    // Instead, return an error object with the message
    console.log(error.message);
    console.log(error.code);
    return { error: "Please use a different username." };
  }

  // ✅ Success: Revalidate and redirect
  // Note: Only redirect on success, as a successful sign-up should take the user away.
  revalidatePath("/", "layout");
  redirect("/");
}
