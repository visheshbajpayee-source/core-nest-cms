"use client";

import { useEffect, useState } from "react";
import AnnouncementTable from "../component/AnnouncementTable";
export interface AnnouncementUI {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: "High" | "Medium" | "Low";
}

/* ---------- Priority Mapper ---------- */
function mapPriority(priority: string): "High" | "Medium" | "Low" | "important" {
  switch (priority.toLowerCase()) {
    case "important":
      return "High";
    case "normal":
      return "Medium";
    default:
      return "Low";
  }
}

export default function AnnouncementClient() {
  const [announcements, setAnnouncements] = useState<
    AnnouncementUI[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const token = `Bearer ${localStorage.getItem("accessToken")}`;
        console.log(token);

        const res = await fetch(
          "http://localhost:5000/api/v1/announcements",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch announcements");
        }

        const json = await res.json();

        const formatted: AnnouncementUI[] =
          json.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.content,
            date: new Date(
              item.publishedAt
            ).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            priority: mapPriority(item.priority),
          }));

        setAnnouncements(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  /* ---------- UI STATES ---------- */

  if (loading)
    return (
      <p className="text-gray-500">Loading announcements...</p>
    );

  if (error)
    return (
      <p className="text-red-500">
        Error: {error}
      </p>
    );

  return (
    <AnnouncementTable announcements={announcements} />
  );
}