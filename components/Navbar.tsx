'use client';

import { UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Freelance Marketplace
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/missions">
              <Button
                variant={pathname === "/missions" ? "default" : "ghost"}
                className="text-gray-700 dark:text-gray-200"
              >
                Missions
              </Button>
            </Link>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95 transition-transform"
            >
              {isConnecting ? 'Connecting...' : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
            </Button>
            {isSignedIn ? (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700",
                    userButtonPopoverActionButton: "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                    userButtonPopoverFooter: "border-t border-gray-200 dark:border-gray-700"
                  }
                }}
              />
            ) : (
              <Link href="/sign-in">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}