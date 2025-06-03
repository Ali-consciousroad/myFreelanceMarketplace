"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface Mission {
  id: string;
  title: string;
  description: string;
  dailyRate: number;
  timeframe: number;
  status: string;
}

export default function MissionsPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const fetchMissions = async () => {
      try {
        const response = await fetch("/api/missions");
        if (!response.ok) {
          throw new Error("Failed to fetch missions");
        }
        const data = await response.json();
        setMissions(data);
      } catch (error) {
        console.error("Error fetching missions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [userId, router]);

  if (!userId) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 dark:text-gray-400">Loading missions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Missions</h1>
        <Button
          onClick={() => router.push("/missions/new")}
          className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 border border-blue-700 dark:border-blue-500"
        >
          Create New Mission
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <div key={mission.id} className="glass-card flex flex-col h-full p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{mission.title}</CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-300">
                ${mission.dailyRate}/day • {mission.timeframe} days
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-gray-700 dark:text-gray-200 mb-6" style={{ minHeight: '60px', maxHeight: '60px', overflow: 'hidden' }}>
                {mission.description.length > 200 ? mission.description.slice(0, 200) + '…' : mission.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push(`/missions/${mission.id}`)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 border border-blue-700 dark:border-blue-500"
              >
                View Details
              </Button>
            </CardFooter>
          </div>
        ))}
      </div>
    </div>
  );
} 