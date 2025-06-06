"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Mission as PrismaMission, MissionStatus } from '@prisma/client';

interface Mission extends Omit<PrismaMission, 'dailyRate'> {
  dailyRate: number;
  skills: string[];
}

export default function MissionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dailyRate: 0,
    timeframe: 0,
    skills: [] as string[],
    status: 'OPEN' as MissionStatus
  });

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const response = await fetch(`/api/missions/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mission');
        }
        const data = await response.json();
        setMission(data);
        setFormData({
          title: data.title,
          description: data.description,
          dailyRate: data.dailyRate,
          timeframe: data.timeframe,
          skills: data.skills,
          status: data.status
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch mission');
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/missions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update mission');
      }

      const updatedMission = await response.json();
      setMission(updatedMission);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mission');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this mission?')) {
      return;
    }

    try {
      const response = await fetch(`/api/missions/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete mission');
      }

      router.push('/missions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete mission');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="glass-card p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="glass-card p-8">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() => router.push('/missions')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Missions
          </button>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen p-8">
        <div className="glass-card p-8">
          <div className="text-gray-500 dark:text-gray-400">Mission not found</div>
          <button
            onClick={() => router.push('/missions')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Missions
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === mission.clientId;

  return (
    <div className="min-h-screen p-8">
      <div className="glass-card p-8">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Daily Rate (€)
              </label>
              <input
                type="number"
                id="dailyRate"
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
                min="0"
              />
            </div>

            <div>
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Timeframe (days)
              </label>
              <input
                type="number"
                id="timeframe"
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
                min="1"
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                id="skills"
                value={formData.skills.join(', ')}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{mission.title}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Posted by {mission.clientId}
                </p>
              </div>
              {isOwner && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300">{mission.description}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Rate</dt>
                    <dd className="mt-1 text-lg text-gray-900 dark:text-white">€{Number(mission.dailyRate)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeframe</dt>
                    <dd className="mt-1 text-lg text-gray-900 dark:text-white">{mission.timeframe} days</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Budget</dt>
                    <dd className="mt-1 text-lg text-gray-900 dark:text-white">€{Number(mission.dailyRate) * mission.timeframe}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        mission.status === 'OPEN' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {mission.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {mission.skills && mission.skills.length > 0 ? (
                    mission.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No skills specified</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => router.push('/missions')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Back to Missions
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 