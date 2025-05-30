"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Code2, Briefcase } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Freelance Marketplace
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with top talent or find your next project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Builder Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-6 w-6" />
                I'm a Builder
              </CardTitle>
              <CardDescription>
                Find projects that match your skills and start building your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Browse available projects</li>
                <li>• Showcase your skills</li>
                <li>• Build your portfolio</li>
                <li>• Get paid for your work</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => router.push('/missions')}
              >
                Find Projects
              </Button>
            </CardFooter>
          </Card>

          {/* Project Owner Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                I'm a Project Owner
              </CardTitle>
              <CardDescription>
                Post your project and find the perfect builder for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Post your project</li>
                <li>• Review builder profiles</li>
                <li>• Manage your projects</li>
                <li>• Track progress</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => router.push('/missions/new')}
              >
                Post a Project
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
