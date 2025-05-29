"use client";

import { useState, useEffect } from "react";
import Card from "@/components/home/card";
import { DEPLOY_URL } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { nFormatter } from "@/lib/utils";
import MissionList from "./components/MissionList";
import { Button } from "@/components/ui/button";
import { Card as UiCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Search } from "@/components/search";
import TeamSwitcher from "@/components/team-switcher";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/repos/steven-tey/precedent")
    .then((res) => res.json())
      .then((data) => setStars(data.stargazers_count))
    .catch((e) => console.log(e));
  }, []);

  return (
    <div className="container mx-auto px-5 py-10">
      <div className="mb-10 mt-5">
        <div className="mt-16 flex justify-center">
        <a
          href="https://twitter.com/steventey/status/1613928948915920896"
          target="_blank"
          rel="noreferrer"
            className="inline-flex items-center space-x-2 rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
        >
          <Twitter className="h-5 w-5 text-[#1d9bf0]" />
          <p className="text-sm font-semibold text-[#1d9bf0]">
            Introducing Precedent
          </p>
        </a>
        </div>
        <div className="text-center">
          <h1 className="mt-5 bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-4xl font-bold tracking-[-0.02em] text-transparent md:text-7xl md:leading-[5rem]">
            Mission Management
        </h1>
          <p className="mt-6 text-gray-500 md:text-xl">
            Create, edit, and manage your missions in one place.
        </p>
          <div className="mt-6 flex items-center justify-center space-x-5">
          <a
              className="group flex items-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            href={DEPLOY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="h-4 w-4 group-hover:text-black"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L20 20H4L12 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Deploy to Vercel</p>
          </a>
          <a
              className="flex items-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
            href="https://github.com/steven-tey/precedent"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>
              <span className="hidden sm:inline-block">Star on</span> GitHub{" "}
              <span className="font-semibold">{nFormatter(stars)}</span>
            </p>
          </a>
        </div>
      </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <MissionList />
      </div>
    </div>
  );
}

const features = [
  {
    title: "Beautiful, reusable components",
    description:
      "Pre-built beautiful, a11y-first components, powered by [Tailwind CSS](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com), and [Framer Motion](https://framer.com/motion). Used in production on [Dub.co](https://dub.co).",
    large: true,
  },
  {
    title: "Performance first",
    description:
      "Built on [Next.js](https://nextjs.org/) primitives like `@next/font` and `next/image` for stellar performance.",
    demo: <WebVitals />,
  },
  {
    title: "One-click Deploy",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
      <a href={DEPLOY_URL}>
        <Image
          src="https://vercel.com/button"
          alt="Deploy with Vercel"
          width={120}
          height={30}
          unoptimized
        />
      </a>
    ),
  },
  {
    title: "Built-in Auth",
    description:
      "Precedent comes with authentication via [Clerk](https://clerk.com/)",
    demo: (
      <div className="flex items-center justify-center space-x-20">
        <Image alt="Clerk logo" src="/clerk.svg" width={50} height={50} />
      </div>
    ),
  },
  {
    title: "Hooks, utilities, and more",
    description:
      "Precedent offers a collection of hooks, utilities, and `@vercel/og`",
    demo: (
      <div className="grid grid-flow-col grid-rows-3 gap-10 p-10">
        <span className="font-mono font-semibold">useIntersectionObserver</span>
        <span className="font-mono font-semibold">useLocalStorage</span>
        <span className="font-mono font-semibold">useScroll</span>
        <span className="font-mono font-semibold">nFormatter</span>
        <span className="font-mono font-semibold">capitalize</span>
        <span className="font-mono font-semibold">truncate</span>
      </div>
    ),
  },
];
