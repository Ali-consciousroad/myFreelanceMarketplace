"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface Mission {
  id: string;
  title: string;
  description: string;
  dailyRate: number;
  timeframe: number;
  status: string;
  clientId: string;
}

export default function MissionsPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [myClientId, setMyClientId] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
    fetchMyClientId();
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

  const fetchMyClientId = async () => {
    if (!userId) return;
    const res = await fetch('/api/me');
    if (!res.ok) return;
    const data = await res.json();
    if (data.isClient && data.clientId) setMyClientId(data.clientId);
    else if (data.isClient && data.client && data.client.id) setMyClientId(data.client.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this mission?')) return;
    try {
      const response = await fetch(`/api/missions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete mission');
      setMissions(missions.filter(m => m.id !== id));
    } catch (error) {
      alert('Failed to delete mission.');
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
            <Card key={mission.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{mission.title}</CardTitle>
                <CardDescription>
                  ${mission.dailyRate}/day • {mission.timeframe} days
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-600 mb-6" style={{ minHeight: '60px', maxHeight: '60px', overflow: 'hidden' }}>
                  {mission.description.length > 200 ? mission.description.slice(0, 200) + '…' : mission.description}
                </p>
                <div className="flex items-end justify-between mt-auto gap-2">
                  <span className={`px-2 py-1 rounded-full ${
                    mission.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                    mission.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {mission.status}
                  </span>
                  <Button 
                    className="ml-2"
                    onClick={() => router.push(`/missions/${mission.id}`)}
                  >
                    View Details
                  </Button>
                  {myClientId && mission.clientId === myClientId && (
                    <Button 
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleDelete(mission.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 