"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Mission {
  id: string;
  status: string;
  dailyRate: number;
  timeframe: number;
  description: string;
  clientId: string;
  categories: Array<{ id: string; name: string }>;
}

export default function MissionTestPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [missionId, setMissionId] = useState("");
  const [formData, setFormData] = useState({
    status: "OPEN",
    dailyRate: 500,
    timeframe: 30,
    description: "Test mission description",
    clientId: "",
    categoryIds: [] as string[],
  });

  if (!isLoaded || !isSignedIn) {
    return <div className="p-8">Please sign in to access the test panel.</div>;
  }

  const handleGetAll = async () => {
    try {
      const response = await fetch("/api/missions");
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ error: "Failed to fetch missions" }, null, 2));
    }
  };

  const handleGetOne = async () => {
    if (!missionId) {
      setResult(JSON.stringify({ error: "Please enter a mission ID" }, null, 2));
      return;
    }
    try {
      const response = await fetch(`/api/missions/${missionId}`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ error: "Failed to fetch mission" }, null, 2));
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ error: "Failed to create mission" }, null, 2));
    }
  };

  const handleUpdate = async () => {
    if (!missionId) {
      setResult(JSON.stringify({ error: "Please enter a mission ID" }, null, 2));
      return;
    }
    try {
      const response = await fetch(`/api/missions/${missionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ error: "Failed to update mission" }, null, 2));
    }
  };

  const handleDelete = async () => {
    if (!missionId) {
      setResult(JSON.stringify({ error: "Please enter a mission ID" }, null, 2));
      return;
    }
    try {
      const response = await fetch(`/api/missions/${missionId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ error: "Failed to delete mission" }, null, 2));
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mission CRUD Test Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission ID Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mission ID (for Get/Update/Delete)
            </label>
            <input
              type="text"
              value={missionId}
              onChange={(e) => setMissionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter mission ID"
            />
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Rate
            </label>
            <input
              type="number"
              value={formData.dailyRate}
              onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe (days)
            </label>
            <input
              type="number"
              value={formData.timeframe}
              onChange={(e) => setFormData({ ...formData, timeframe: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID
            </label>
            <input
              type="text"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter client ID"
            />
          </div>
        </div>

        {/* CRUD Operations */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGetAll}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Get All Missions
            </button>
            <button
              onClick={handleGetOne}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Get One Mission
            </button>
            <button
              onClick={handleCreate}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Create Mission
            </button>
            <button
              onClick={handleUpdate}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Update Mission
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Mission
            </button>
          </div>

          {/* Results Display */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Results:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {result || "No results yet"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 