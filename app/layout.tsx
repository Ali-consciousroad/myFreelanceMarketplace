import "./globals.css";
import cx from "classnames";
import { sfPro } from "./fonts";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata = {
  title: "Mission Management",
  description: "Create, edit, and manage your missions in one place",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${sfPro.variable} min-h-screen`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#0ea5e9",
              colorBackground: "#0f172a",
              colorText: "#f8fafc",
              colorInputBackground: "#1e293b",
              colorInputText: "#f8fafc",
            },
          }}
        >
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <VercelAnalytics />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
