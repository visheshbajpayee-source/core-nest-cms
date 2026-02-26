// Project data and types
export type ProjectStatus = "In Progress" | "Completed" | "Pending";

export interface Project {
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  deadline: string;
}

export const projects: Project[] = [
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
  {
    title: "E-commerce Platform Update",
    description:
      "Major update to the customer-facing e-commerce platform with new payment integrations.",
    status: "In Progress",
    progress: 45,
    deadline: "2026-05-20",
  },
  {
    title: "Security Audit Implementation",
    description:
      "Implementation of security recommendations from the recent cybersecurity audit.",
    status: "Pending",
    progress: 5,
    deadline: "2026-04-15",
  },
  {
    title: "Mobile App Performance Optimization",
    description:
      "Optimization of the mobile application to improve loading times and user experience.",
    status: "In Progress",
    progress: 80,
    deadline: "2026-03-01",
  },
];