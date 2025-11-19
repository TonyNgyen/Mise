import DashboardClient from "@/components/dashboard/dashboard-client";
import RadialGradient from "@/components/radial-gradient";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <RadialGradient />
        <div className="text-center space-y-8 max-w-md z-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-wide text-zinc-900 dark:text-white">
              Alimon
            </h1>
            <div className="h-px w-16 bg-zinc-300 dark:bg-zinc-600 mx-auto"></div>
            <p className="text-lg font-light text-zinc-600 dark:text-zinc-300 tracking-wide uppercase letter-spacing: 0.05em;">
              Meal Prep Made Simple
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="px-8 py-3 rounded-sm border border-zinc-300 text-zinc-700 bg-white dark:bg-[#121212] hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all duration-300 font-light tracking-wide text-sm uppercase"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="px-8 py-3 rounded-sm bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-all duration-300 font-light tracking-wide text-sm uppercase"
            >
              Sign up
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-500 tracking-wide">
            Elevate your meal prep experience
          </p>
        </div>
      </div>
    );
  }
  const { data: userData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  const { data: recentMealsRaw } = await supabase
    .from("food_logs")
    .select(
      `id, log_datetime,
      ingredient:ingredients!left(name),
      recipe:recipes!left(name),
      nutrients:food_log_nutrients(nutrient_key, amount)`
    )
    .eq("user_id", data.user.id)
    .order("log_datetime", { ascending: false })
    .limit(3);

  const { data: inventoryItemsRaw } = await supabase
    .from("inventories")
    .select(
      `
        id,
        quantity,
        unit,
        created_at,
        ingredient:ingredient_id (
          id,
          name,
          brand,
          units:ingredient_units (
            id,
            unit_name,
            is_default,
            amount
          )
        ),
        recipe:recipe_id (
          id,
          name,
          servings
        )
      `
    )
    .eq("user_id", data.user.id);

  // Transform data
  const inventoryItems =
    inventoryItemsRaw?.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unit: item.unit,
      ingredient: Array.isArray(item.ingredient)
        ? item.ingredient[0]
        : item.ingredient,
      recipe: Array.isArray(item.recipe) ? item.recipe[0] : item.recipe,
    })) || [];

  const recentMeals =
    recentMealsRaw?.map((meal) => ({
      ...meal,
      ingredient: Array.isArray(meal.ingredient)
        ? meal.ingredient[0]
        : meal.ingredient,
      recipe: Array.isArray(meal.recipe) ? meal.recipe[0] : meal.recipe,
    })) || [];

  // Pass to client component for state management
  return (
    <DashboardClient
      userData={userData}
      initialRecentMeals={recentMeals}
      initialInventoryItems={inventoryItems}
    />
  );
}
