"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Code2, Briefcase } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-[#181c2f] dark:to-[#232946] transition-colors">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Freelance Marketplace
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Connect with top talent or find your next project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Builder Section */}
          <div className="glass-card p-8 flex flex-col justify-between shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-300 dark:focus-within:ring-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Code2 className="h-6 w-6 text-blue-400 dark:text-blue-300" />
                I'm a Builder
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-300">
                Find projects that match your skills and start building your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li>• Browse available projects</li>
                <li>• Showcase your skills</li>
                <li>• Build your portfolio</li>
                <li>• Get paid for your work</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 border border-blue-200 dark:border-blue-800"
                onClick={() => router.push('/missions')}
              >
                Find Projects
              </Button>
            </CardFooter>
          </div>

          {/* Project Owner Section */}
          <div className="glass-card p-8 flex flex-col justify-between shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-purple-300 dark:focus-within:ring-purple-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Briefcase className="h-6 w-6 text-purple-400 dark:text-purple-300" />
                I'm a Project Owner
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-300">
                Post your project and find the perfect builder for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li>• Post your project</li>
                <li>• Review builder profiles</li>
                <li>• Manage your projects</li>
                <li>• Track progress</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 dark:focus-visible:ring-purple-600 border border-purple-200 dark:border-purple-800"
                onClick={() => router.push('/missions/new')}
              >
                Post a Project
              </Button>
            </CardFooter>
          </div>
        </div>
      </div>
    </div>
  );
}
