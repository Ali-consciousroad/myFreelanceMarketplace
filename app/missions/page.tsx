"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Mission {
  id: string;
  description: string;
  dailyRate: number;
  timeframe: number;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  client: {
    id: string;
    company: string;
    user: {
      id: string;
      login: string;
    };
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
}

export default function MissionsPage() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
    
    if (isSignedIn) {
      fetchMissions();
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchMissions = async () => {
    try {
      const response = await fetch("/api/missions");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch missions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMissions(data);
    } catch (err) {
      console.error("Error in fetchMissions:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this mission?")) return;
    
    try {
      const response = await fetch(`/api/missions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete mission");
      await fetchMissions(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete mission");
    }
  };

  if (!isLoaded) {
    return <div className="p-8">Loading authentication...</div>;
  }

  if (!isSignedIn) {
    return <div className="p-8">Please sign in to view missions.</div>;
  }

  if (loading) {
    return <div className="p-8">Loading missions...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Missions</h1>
        <Link 
          href="/missions/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create New Mission
        </Link>
      </div>

      {missions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No missions found. Create your first mission!
        </div>
      ) : (
        <div className="grid gap-6">
          {missions.map((mission) => (
            <div 
              key={mission.id} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {mission.client.company}
                  </h2>
                  <p className="text-gray-600 mb-4">{mission.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>${mission.dailyRate}/day</span>
                    <span>{mission.timeframe} days</span>
                    <span className={`px-2 py-1 rounded ${
                      mission.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                      mission.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                      mission.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {mission.status}
                    </span>
                  </div>
                  {mission.categories.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {mission.categories.map(category => (
                        <span 
                          key={category.id}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/missions/${mission.id}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(mission.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 