"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

interface Mission {
  id: string;
  title: string;
  description: string;
  dailyRate: number;
  timeframe: number;
  status: string;
  skills: string[];
  client?: {
    user?: {
      id: string;
    };
  };
}

export default function MissionsPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useUser();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dailyRate: 0,
    timeframe: 0,
    skills: [] as string[],
    status: 'OPEN'
  });

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

  const isOwner = (mission: Mission) => {
    return userId === mission.client?.user?.id;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMission) return;

    try {
      const response = await fetch(`/api/missions/${editingMission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dailyRate: formData.dailyRate,
          timeframe: formData.timeframe,
          skills: formData.skills || [],
          status: formData.status
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update mission");
      }

      const updatedMission = await response.json();
      setMissions(missions.map(m => m.id === editingMission.id ? updatedMission : m));
      setEditingMission(null);
      router.refresh();
    } catch (error) {
      console.error("Error updating mission:", error);
    }
  };

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
    <div className="container mx-auto px-4 py-8 mt-16">
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
            {editingMission?.id === mission.id ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Daily Rate (€)</label>
                  <input
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timeframe (days)</label>
                  <input
                    type="number"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={formData.skills.join(', ')}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') })}
                      placeholder="e.g. React, Node.js, TypeScript"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Enter skills separated by commas
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    onClick={() => setEditingMission(null)}
                    className="bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{mission.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-300">
                    €{mission.dailyRate}/day • {mission.timeframe} days
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-gray-700 dark:text-gray-200 mb-4" style={{ minHeight: '60px', maxHeight: '60px', overflow: 'hidden' }}>
                    {mission.description.length > 200 ? mission.description.slice(0, 200) + '…' : mission.description}
                  </p>
                  {mission.skills && mission.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mission.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    onClick={() => router.push(`/missions/${mission.id}`)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    View Details
                  </Button>
                  {isOwner(mission) && (
                    <Button
                      onClick={() => {
                        setEditingMission(mission);
                        setFormData({
                          title: mission.title,
                          description: mission.description,
                          dailyRate: mission.dailyRate,
                          timeframe: mission.timeframe,
                          skills: mission.skills || [],
                          status: mission.status
                        });
                      }}
                      className="bg-gray-600 text-white hover:bg-gray-700"
                    >
                      Edit
                    </Button>
                  )}
                </CardFooter>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 