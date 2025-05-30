"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await fetch('/api/missions');
      if (!response.ok) throw new Error('Failed to fetch missions');
      const data = await response.json();
      setMissions(data);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20 pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Missions</h1>
        <Button 
          onClick={() => router.push('/missions/new')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Mission
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading missions...</div>
      ) : missions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No missions available. Be the first to post one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <Card key={mission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{mission.title}</CardTitle>
                <CardDescription>
                  ${mission.dailyRate}/day • {mission.timeframe} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{mission.description}</p>
                <div className="mt-4 flex justify-end">
                  <span className={`px-2 py-1 rounded-full ${
                    mission.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                    mission.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {mission.status}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => router.push(`/missions/${mission.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 