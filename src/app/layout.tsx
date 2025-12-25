import type { Metadata } from "next";
import "./globals.css";
import SidebarNav from "@/components/sidebar-nav";
import TopNav from "@/components/top-nav";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/components/footer";
import AuthFooter from "@/components/auth-footer";

export const metadata: Metadata = {
  title: "meap",
  description: "Meal prep and planning app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  const isAdmin = user?.id === process.env.ADMIN_USER_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {user ? (
            <main className="flex h-screen">
              <SidebarNav isAdmin={isAdmin} />

              <div className="flex-1 flex flex-col overflow-y-auto">
                <main className="flex-1 p-6 bg-zinc-200 dark:bg-zinc-900">
                  {children}
                </main>

                <AuthFooter />
              </div>
            </main>
          ) : (
            <>
              <div className="min-h-screen flex flex-col bg-[#F7F9FA] dark:bg-zinc-900">
                <TopNav />
                {children}
              </div>
              <Footer />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
