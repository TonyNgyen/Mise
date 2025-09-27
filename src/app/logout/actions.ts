"use server";

import { createClient } from "@/utils/supabase/server";

export async function logout(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
}
