import IngredientsList from "@/components/ingredient-list";
import { createClient } from "@/utils/supabase/server";
import React from "react";

async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  return <IngredientsList user_id={user?.id || ""} />;
}

export default Page;
