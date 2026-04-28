"use client";

import { useEffect, useState } from "react";
import AnnouncementTable from "../component/AnnouncementTable";
import { getAnnouncements, type Announcement } from "@/app/services";

export interface AnnouncementUI {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: "High" | "Medium" | "Low" | "important";
}

/* ---------- Priority Mapper ---------- */
function mapPriority(priority: string): "High" | "Medium" | "Low" | "important" {
  switch (priority.toLowerCase()) {
    case "urgent":
      return "High";
    case "important":
      return "important";
    case "normal":
      return "Medium";
    default:
      return "Low";
  }
}

export default function AnnouncementClient() {
  const [announcements, setAnnouncements] = useState<AnnouncementUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setLoading(true);
        const data = await getAnnouncements();

        const formatted: AnnouncementUI[] = data.map((item: Announcement) => ({
          id: item._id || item.id || "",
          title: item.title,
          description: item.content,
          date: new Date(item.createdAt || new Date()).toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          ),
          priority: mapPriority(item.priority),
        }));

        setAnnouncements(formatted);
        setError("");
      } catch (err: any) {
        setError(err?.message || "Failed to fetch announcements");
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  /* ---------- UI STATES ---------- */

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Loading announcements...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );

  if (announcements.length === 0)
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">No announcements available</p>
      </div>
    );

  return (
    <AnnouncementTable announcements={announcements} />
  );
}