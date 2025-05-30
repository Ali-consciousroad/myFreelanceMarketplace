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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          formFieldInput: "bg-gray-800 text-white border-gray-600",
          formFieldLabel: "text-gray-300",
          formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-200",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
        </head>
        <body className={cx(sfPro.variable)}>
          <Suspense fallback="...">
            <Navbar />
          </Suspense>
          <main className="w-full">
            {children}
          </main>
          <Footer />
          <VercelAnalytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
