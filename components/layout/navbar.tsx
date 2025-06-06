"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function NavBar() {
  const scrolled = useScroll(50);
  const [theme, setTheme] = useState<'light' | 'dark'>(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav
      className={`fixed top-0 flex w-full justify-center glass-nav z-30 transition-all`}
      aria-label="Main navigation"
    >
      <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center font-display text-2xl text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg">
          <Image
            src="/logo.png"
            alt="Logo"
            width="30"
            height="30"
            className="mr-2 rounded-sm"
          />
          <span className="font-bold tracking-tight">Consciousroad</span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            className="neon-btn px-5 py-2 font-semibold text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Connect Wallet (coming soon)"
            tabIndex={0}
            disabled
            style={{ opacity: 0.85, cursor: 'not-allowed' }}
          >
            Connect Wallet
          </button>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-full border border-white bg-transparent p-2 text-white hover:bg-white hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            style={{ minWidth: 40, minHeight: 40 }}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full border border-white bg-transparent px-4 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-white bg-transparent px-4 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
