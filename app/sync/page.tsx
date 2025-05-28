"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SyncPage() {
  const [status, setStatus] = useState<string>("Syncing...");
  const router = useRouter();

  useEffect(() => {
    async function syncUser() {
      try {
        const response = await fetch("/api/sync-user");
        const data = await response.json();
        
        if (data.success) {
          setStatus(`Success! Role: ${data.user.role}`);
          // Redirect to test page after 2 seconds
          setTimeout(() => {
            router.push("/test/missions");
          }, 2000);
        } else {
          setStatus("Error: " + data.error);
        }
      } catch (error) {
        setStatus("Error syncing user");
      }
    }

    syncUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Syncing User Role</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
} 