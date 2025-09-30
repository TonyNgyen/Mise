import { createClient } from "@/utils/supabase/server";
import { logout } from "./logout/actions";
import Link from "next/link";
import InventoryCard from "@/components/dashboard/inventory-card";
import NutrientOverview from "@/components/dashboard/nutrient-overview";
import RadialGradient from "@/components/radial-gradient";

type FoodLogNutrient = {
  nutrient_key: string;
  amount: number;
};

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <RadialGradient />
        <div className="text-center space-y-8 max-w-md z-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-wide text-gray-900 dark:text-white">
              Mise
            </h1>
            <div className="h-px w-16 bg-gray-300 dark:bg-gray-600 mx-auto"></div>
            <p className="text-lg font-light text-gray-600 dark:text-gray-300 tracking-wide uppercase letter-spacing: 0.05em;">
              Meal Prep Made Simple
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="px-8 py-3 rounded-sm border border-gray-300 text-gray-700 bg-white dark:bg-[#121212] hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-300 font-light tracking-wide text-sm uppercase"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="px-8 py-3 rounded-sm bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 transition-all duration-300 font-light tracking-wide text-sm uppercase"
            >
              Sign up
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500 tracking-wide">
            Elevate your meal prep experience
          </p>
        </div>
      </div>
    );
  }

  // Fetch user data for dashboard
  const { data: userData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  // Fetch recent meals (last 3 logs)
  const { data: recentMeals } = await supabase
    .from("food_logs")
    .select(
      `
        *,
        ingredient:ingredients(name),
        recipe:recipes(name),
        nutrients:food_log_nutrients(nutrient_key, amount)
      `
    )
    .eq("user_id", data.user.id)
    .order("logged_at", { ascending: false })
    .limit(3);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userData?.first_name || "Chef"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s your overview for today
          </p>
        </div>
        <form>
          <button
            formAction={logout}
            className="cursor-pointer px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Nutrition Overview Cards */}
      <NutrientOverview />

      {/* Quick Actions */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <QuickAction icon="🍎" title="Log Food" href="/foodlog" color="blue" />
        <QuickAction icon="📖" title="Recipes" href="/recipes" color="green" />
        <QuickAction
          icon="📦"
          title="Inventory"
          href="/inventory"
          color="amber"
        />
        <QuickAction
          icon="🥕"
          title="Ingredients"
          href="/ingredients"
          color="purple"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Meals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Meals
          </h2>
          <div className="space-y-3">
            {recentMeals?.length ? (
              recentMeals.map((meal) => {
                const name =
                  meal.ingredient?.name || meal.recipe?.name || "Unknown";
                // const time = new Date(meal.logged_at).toLocaleTimeString([], {
                //   hour: "2-digit",
                //   minute: "2-digit",
                // });
                const calories = meal.nutrients?.find(
                  (n: FoodLogNutrient) => n.nutrient_key === "calories"
                )?.amount;

                return (
                  <MealItem
                    key={meal.id}
                    name={name}
                    calories={calories ? calories.toString() : "-"}
                  />
                );
              })
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No recent meals logged.
              </p>
            )}
          </div>
        </div>

        {/* Inventory Status */}
        <InventoryCard />
      </div>
    </div>
  );
}

// Helper Components
function QuickAction({
  icon,
  title,
  href,
  color,
}: {
  icon: string;
  title: string;
  href: string;
  color: "blue" | "green" | "amber" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    purple: "bg-purple-600 hover:bg-purple-700",
  };

  return (
    <Link
      href={href}
      className={`${colorClasses[color]} text-white p-6 rounded-xl text-center transition-colors transform hover:scale-105`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-medium">{title}</div>
    </Link>
  );
}

function MealItem({ name, calories }: { name: string; calories: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{name}</div>
        {/* <div className="text-sm text-gray-600 dark:text-gray-400">{time}</div> */}
      </div>
      <div className="text-right">
        <div className="font-bold text-gray-900 dark:text-white">
          {calories} cal
        </div>
      </div>
    </div>
  );
}
