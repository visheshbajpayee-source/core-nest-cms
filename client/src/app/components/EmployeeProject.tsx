"use client";

import { useState, ChangeEvent } from "react";

type ProjectStatus = "In Progress" | "Completed" | "Pending";

interface Project {
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  deadline: string;
}

const projects: Project[] = [
  {
    title: "Alpha Analytics Redesign",
    description:
      "Complete redesign of the main analytics dashboard for the Alpha client enterprise suite.",
    status: "In Progress",
    progress: 70,
    deadline: "2026-03-15",
  },
  {
    title: "iOS API Integration",
    description:
      "API connection setup for the new IOS application rollout scheduled for Q4.",
    status: "Pending",
    progress: 10,
    deadline: "2026-04-01",
  },
  {
    title: "Brand Asset Migration",
    description:
      "Transfer and organization of all legacy brand assets to the new cloud DAM system.",
    status: "Completed",
    progress: 100,
    deadline: "2026-01-30",
  },
];

export default function EmployeeProject() {
  const [search, setSearch] = useState("");

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: ProjectStatus) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold";

    if (status === "Completed")
      return (
        <span className={`${base} bg-green-100 text-green-700`}>
          Completed
        </span>
      );
    if (status === "Pending")
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>
          Pending
        </span>
      );

    return (
      <span className={`${base} bg-indigo-100 text-indigo-700`}>
        In Progress
      </span>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Projects
        </h1>
        <p className="text-gray-500">
          View and manage your assigned projects.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Project List
        </h2>

        <input
          type="text"
          className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
          placeholder="Search projects..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            No projects found.
          </div>
        ) : (
          filtered.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">
                  {project.title}
                </h3>
                {statusBadge(project.status)}
              </div>

              <p className="text-gray-500 text-sm line-clamp-2">
                {project.description}
              </p>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                Deadline: {project.deadline}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
