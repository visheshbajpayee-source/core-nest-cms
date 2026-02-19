import React from "react";

type AnnouncementStatus = "Published" | "Draft" | "Archived";

interface Announcement {
  id: string;
  title: string;
  description: string;
  status: AnnouncementStatus;
  date: string;
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "System Maintenance",
    description:
      "The system will be down for maintenance on February 25 from 1AM to 3AM.",
    status: "Published",
    date: "2026-02-18",
  },
  {
    id: "2",
    title: "New Leave Policy Update",
    description:
      "We have updated the leave policy. Please review the HR section.",
    status: "Draft",
    date: "2026-02-15",
  },
  {
    id: "3",
    title: "Holiday Announcement",
    description:
      "Office will remain closed on March 1st due to public holiday.",
    status: "Archived",
    date: "2026-01-30",
  },
];

function getStatusStyle(status: AnnouncementStatus) {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-700";
    case "Draft":
      return "bg-yellow-100 text-yellow-700";
    case "Archived":
      return "bg-red-100 text-red-700";
  }
}

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Announcements
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and review all announcements
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>

              <tbody>
                {announcements.map((announcement) => (
                  <tr
                    key={announcement.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {announcement.title}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {announcement.description}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          announcement.status
                        )}`}
                      >
                        {announcement.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {announcement.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
