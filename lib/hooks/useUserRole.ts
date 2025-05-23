import { useState, useEffect } from 'react';

interface UserRole {
  id: string;
  role: 'FREELANCER' | 'CLIENT' | 'ADMIN' | 'SUPPORT';
  isClient: boolean;
  isFreelancer: boolean;
}

export function useUserRole() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch('/api/me');
        if (!response.ok) {
          throw new Error('Failed to fetch user role');
        }
        const data = await response.json();
        setUserRole(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user role');
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  return { userRole, loading, error };
} 