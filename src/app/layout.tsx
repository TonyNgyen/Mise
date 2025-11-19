import type { Metadata } from "next";
import "./globals.css";
import SidebarNav from "@/components/sidebar-nav";
import TopNav from "@/components/top-nav";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Mise",
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="flex h-screen overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {user ? (
            <>
              <SidebarNav />
              <main className="flex-1 overflow-y-auto p-6 bg-gray-100">{children}</main>
            </>
          ) : (
            <div className="flex flex-col w-full h-screen">
              <TopNav />
              <main className="flex-1 flex-col flex overflow-y-auto">
                {children}
              </main>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
