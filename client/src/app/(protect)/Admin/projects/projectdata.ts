export interface TeamMember {
  _id: string;
  fullName: string;
  employeeId: string;
  email: string;
  designation: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  expectedEndDate: string;
  status: "not_started" | "in_progress" | "completed" | "on_hold";
  department?: { _id: string; name: string };
  teamMembers: TeamMember[];
}

// ── Employee pool used in the "Add Members" search ────────────────────────────
export const dummyEmployees: TeamMember[] = [
  { _id: "e1",  fullName: "Aryan Mehta",   employeeId: "EMP001", email: "aryan.mehta@coreinc.io",   designation: "Senior Frontend Dev" },
  { _id: "e2",  fullName: "Deepak Joshi",  employeeId: "EMP002", email: "deepak.joshi@coreinc.io",  designation: "DevOps Engineer" },
  { _id: "e3",  fullName: "Simran Batra",  employeeId: "EMP003", email: "simran.batra@coreinc.io",  designation: "QA Lead" },
  { _id: "e4",  fullName: "Priya Sharma",  employeeId: "EMP004", email: "priya.sharma@coreinc.io",  designation: "Backend Developer" },
  { _id: "e5",  fullName: "Anita Rao",     employeeId: "EMP005", email: "anita.rao@coreinc.io",     designation: "Data Analyst" },
  { _id: "e6",  fullName: "Kartik Menon",  employeeId: "EMP006", email: "kartik.menon@coreinc.io",  designation: "Product Manager" },
  { _id: "e7",  fullName: "Rahul Verma",   employeeId: "EMP007", email: "rahul.verma@coreinc.io",   designation: "UI/UX Designer" },
  { _id: "e8",  fullName: "Rohit Singh",   employeeId: "EMP008", email: "rohit.singh@coreinc.io",   designation: "Full Stack Dev" },
  { _id: "e9",  fullName: "Nisha Gupta",   employeeId: "EMP009", email: "nisha.gupta@coreinc.io",   designation: "Mobile Developer" },
  { _id: "e10", fullName: "Sneha Kapoor",  employeeId: "EMP010", email: "sneha.kapoor@coreinc.io",  designation: "Marketing Analyst" },
  { _id: "e11", fullName: "Meera Pillai",  employeeId: "EMP011", email: "meera.pillai@coreinc.io",  designation: "Business Analyst" },
  { _id: "e12", fullName: "Aditya Kumar",  employeeId: "EMP012", email: "aditya.kumar@coreinc.io",  designation: "Cloud Architect" },
  { _id: "e13", fullName: "Vikram Nair",   employeeId: "EMP013", email: "vikram.nair@coreinc.io",   designation: "Content Strategist" },
  { _id: "e14", fullName: "Pooja Desai",   employeeId: "EMP014", email: "pooja.desai@coreinc.io",   designation: "HR Specialist" },
  { _id: "e15", fullName: "Kavya Reddy",   employeeId: "EMP015", email: "kavya.reddy@coreinc.io",   designation: "Compliance Officer" },
];

export const dummyProjects: Project[] = [
  {
    _id: "p1",
    name: "Employee Self-Service Portal",
    description: "Build an internal portal allowing employees to manage leaves, view payslips and update their personal profiles. The portal will integrate with the existing HR backend and support role-based access control.",
    startDate: "2026-01-10",
    expectedEndDate: "2026-04-30",
    status: "in_progress",
    department: { _id: "d1", name: "MERN Development" },
    teamMembers: [
      { _id: "e1", fullName: "Aryan Mehta",  employeeId: "EMP001", email: "aryan.mehta@coreinc.io",  designation: "Senior Frontend Dev" },
      { _id: "e4", fullName: "Priya Sharma", employeeId: "EMP004", email: "priya.sharma@coreinc.io", designation: "Backend Developer" },
      { _id: "e7", fullName: "Rahul Verma",  employeeId: "EMP007", email: "rahul.verma@coreinc.io",  designation: "UI/UX Designer" },
    ],
  },
  {
    _id: "p2",
    name: "Q1 Marketing Campaign",
    description: "Plan and execute the Q1 digital marketing campaign across social media, email newsletters and paid search channels. Deliverables include creative assets, copy, A/B test reports and ROI dashboards.",
    startDate: "2026-01-01",
    expectedEndDate: "2026-03-31",
    status: "completed",
    department: { _id: "d2", name: "Data Engineering" },
    teamMembers: [
      { _id: "e10", fullName: "Sneha Kapoor", employeeId: "EMP010", email: "sneha.kapoor@coreinc.io", designation: "Marketing Analyst" },
      { _id: "e13", fullName: "Vikram Nair",  employeeId: "EMP013", email: "vikram.nair@coreinc.io",  designation: "Content Strategist" },
    ],
  },
  {
    _id: "p3",
    name: "ERP System Migration",
    description: "Migrate the company's legacy on-premise ERP to a cloud-based solution with a zero-downtime cutover strategy. Scope covers procurement, inventory, payroll and reporting modules.",
    startDate: "2025-11-15",
    expectedEndDate: "2026-06-30",
    status: "in_progress",
    department: { _id: "d3", name: "Operations" },
    teamMembers: [
      { _id: "e2",  fullName: "Deepak Joshi", employeeId: "EMP002", email: "deepak.joshi@coreinc.io", designation: "DevOps Engineer" },
      { _id: "e5",  fullName: "Anita Rao",    employeeId: "EMP005", email: "anita.rao@coreinc.io",    designation: "Data Analyst" },
      { _id: "e8",  fullName: "Rohit Singh",  employeeId: "EMP008", email: "rohit.singh@coreinc.io",  designation: "Full Stack Dev" },
      { _id: "e11", fullName: "Meera Pillai", employeeId: "EMP011", email: "meera.pillai@coreinc.io", designation: "Business Analyst" },
    ],
  },
  {
    _id: "p4",
    name: "Annual Compliance Audit",
    description: "Conduct the annual HR and financial compliance audit across all departments. Includes policy gap analysis, risk assessments and preparation of the board-level compliance report.",
    startDate: "2026-02-01",
    expectedEndDate: "2026-02-28",
    status: "on_hold",
    department: { _id: "d4", name: "Business Development" },
    teamMembers: [
      { _id: "e15", fullName: "Kavya Reddy", employeeId: "EMP015", email: "kavya.reddy@coreinc.io", designation: "Compliance Officer" },
    ],
  },
  {
    _id: "p5",
    name: "New Onboarding Framework",
    description: "Design a structured 30-60-90 day onboarding programme for new hires. Deliverables include a digital welcome kit, mentor assignment workflow and automated progress check-ins.",
    startDate: "2026-03-01",
    expectedEndDate: "2026-05-15",
    status: "not_started",
    department: { _id: "d5", name: "Human Resources" },
    teamMembers: [
      { _id: "e14", fullName: "Pooja Desai", employeeId: "EMP014", email: "pooja.desai@coreinc.io", designation: "HR Specialist" },
    ],
  },
  {
    _id: "p6",
    name: "Mobile App Redesign",
    description: "Revamp the customer-facing mobile app with a refreshed UI/UX system, improved performance and accessibility compliance. Target platforms: iOS 16+ and Android 12+.",
    startDate: "2025-10-01",
    expectedEndDate: "2026-01-31",
    status: "completed",
    department: { _id: "d1", name: "MERN Development" },
    teamMembers: [
      { _id: "e1",  fullName: "Aryan Mehta", employeeId: "EMP001", email: "aryan.mehta@coreinc.io", designation: "Senior Frontend Dev" },
      { _id: "e9",  fullName: "Nisha Gupta",  employeeId: "EMP009", email: "nisha.gupta@coreinc.io",  designation: "Mobile Developer" },
    ],
  },
];
