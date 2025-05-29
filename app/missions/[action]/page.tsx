"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface MissionFormData {
  title: string;
  description: string;
  dailyRate: number;
  timeframe: number;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export default function MissionForm({ params }: { params: { action: string } }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const isEdit = params.action !== "new";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MissionFormData>({
    title: "",
    description: "",
    dailyRate: 0,
    timeframe: 0,
    status: "DRAFT",
  });

  const fetchMission = useCallback(async () => {
    try {
      const response = await fetch(`/api/missions/${params.action}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch mission");
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch mission");
    }
  }, [params.action]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (isSignedIn && isEdit) {
      fetchMission();
    }
  }, [isLoaded, isSignedIn, isEdit, router, fetchMission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        isEdit ? `/api/missions/${params.action}` : "/api/missions",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to save mission");
      
      router.push("/missions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save mission");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEdit ? "Edit Mission" : "Create New Mission"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rate ($)
              </label>
              <input
                type="number"
                id="dailyRate"
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                Timeframe (days)
              </label>
              <input
                type="number"
                id="timeframe"
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as MissionFormData["status"] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Mission"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/missions")}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 