"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function NewMissionPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dailyRate: "",
    timeframe: "",
  });

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
    }
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Remove leading zeros and convert to numbers
      const dailyRate = parseInt(formData.dailyRate.replace(/^0+/, ''), 10);
      const timeframe = parseInt(formData.timeframe.replace(/^0+/, ''), 10);

      const response = await fetch("/api/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dailyRate,
          timeframe,
          status: "OPEN",
          clientId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create mission");
      }

      router.push("/missions");
    } catch (error) {
      console.error("Error creating mission:", error);
      alert(error instanceof Error ? error.message : "Failed to create mission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For number inputs, remove leading zeros
    if (name === 'dailyRate' || name === 'timeframe') {
      const numValue = value.replace(/^0+/, '') || '0';
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Mission</CardTitle>
          <CardDescription>
            Fill in the details below to post your mission
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter mission title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your mission in detail"
                required
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                <Input
                  id="dailyRate"
                  name="dailyRate"
                  type="number"
                  value={formData.dailyRate}
                  onChange={handleChange}
                  placeholder="Enter daily rate"
                  required
                  min="0"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe (days)</Label>
                <Input
                  id="timeframe"
                  name="timeframe"
                  type="number"
                  value={formData.timeframe}
                  onChange={handleChange}
                  placeholder="Enter timeframe"
                  required
                  min="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Mission"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 