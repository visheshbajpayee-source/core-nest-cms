// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import dotenv from "dotenv";

// import { Employee } from "./modules/employees/employee.model";
// import { Department } from "./modules/department/department.model";
// import { Designation } from "./modules/designation/designation.model";

// dotenv.config();

// /**
//  * Connect to MongoDB
//  */
// const connectDB = async () => {
//     try {
//     const mongoUri = process.env.MONGO_URI;
//     if (!mongoUri) {
//       throw new Error("MONGODB_URI environment variable is not defined");
//     }
//     await mongoose.connect(mongoUri);
//     console.log("✅ MongoDB Connected Successfully\n");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Failed:", error);
//     process.exit(1);
//   }
// };

// const seedDatabase = async () => {
//   try {
//     await connectDB();

//     // 🔐 Hash password once
//     const hashedPassword = await bcrypt.hash("Password@123", 10);

//     // ===============================
//     // DESIGNATIONS (Safe Upsert)
//     // ===============================
//     console.log("📋 Ensuring Designations...");

//     const designationData = [
//       { title: "Senior Manager", description: "Senior level management position" },
//       { title: "Team Lead", description: "Team leadership position" },
//       { title: "Developer", description: "Software development position" },
//     ];

//     for (const designation of designationData) {
//       await Designation.updateOne(
//         { title: designation.title },
//         { $setOnInsert: designation },
//         { upsert: true }
//       );
//     }

//     const designations = await Designation.find();
//     console.log(`✅ Designations Ready (${designations.length})\n`);

//     // ===============================
//     // DEPARTMENTS (Safe Upsert)
//     // ===============================
//     console.log("🏢 Ensuring Departments...");

//     const departmentData = [
//       { name: "Engineering", description: "Engineering Team" },
//       { name: "HR", description: "Human Resources Team" },
//       { name: "Operations", description: "Operations Team" },
//     ];

//     for (const department of departmentData) {
//       await Department.updateOne(
//         { name: department.name },
//         { $setOnInsert: department },
//         { upsert: true }
//       );
//     }

//     const departments = await Department.find();
//     console.log(`✅ Departments Ready (${departments.length})\n`);

//     // ===============================
//     // EMPLOYEES (Safe Upsert)
//     // ===============================
//     console.log("👥 Ensuring Employees...");

//     const dummyEmployees = [
//       {
//         fullName: "Admin User",
//         email: "admin@company.com",
//         password: hashedPassword,
//         phoneNumber: "+1234567890",
//         role: "admin",
//         department: departments[0]._id,
//         designation: designations[0]._id,
//         dateOfJoining: new Date("2024-01-01"),
//         employeeId: "EMP001",
//         status: "active",
//       },
//       {
//         fullName: "Manager One",
//         email: "manager1@company.com",
//         password: hashedPassword,
//         phoneNumber: "+1234567891",
//         role: "manager",
//         department: departments[0]._id,
//         designation: designations[0]._id,
//         dateOfJoining: new Date("2024-02-01"),
//         employeeId: "EMP002",
//         status: "active",
//       },
//       {
//         fullName: "Manager Two",
//         email: "manager2@company.com",
//         password: hashedPassword,
//         phoneNumber: "+1234567892",
//         role: "manager",
//         department: departments[1]._id,
//         designation: designations[0]._id,
//         dateOfJoining: new Date("2024-02-15"),
//         employeeId: "EMP003",
//         status: "active",
//       },
//       {
//         fullName: "Employee One",
//         email: "employee1@company.com",
//         password: hashedPassword,
//         phoneNumber: "+1234567893",
//         role: "employee",
//         department: departments[0]._id,
//         designation: designations[2]._id,
//         dateOfJoining: new Date("2024-03-01"),
//         employeeId: "EMP004",
//         status: "active",
//       },
//       {
//         fullName: "Employee Two",
//         email: "employee2@company.com",
//         password: hashedPassword,
//         phoneNumber: "+1234567894",
//         role: "employee",
//         department: departments[1]._id,
//         designation: designations[2]._id,
//         dateOfJoining: new Date("2024-03-15"),
//         employeeId: "EMP005",
//         status: "active",
//       },
//       {
//         fullName: "Employee Three",
//         email: "employee3@company.com",
//         password: hashedPassword,
//         phoneNumber: "+1234567895",
//         role: "employee",
//         department: departments[2]._id,
//         designation: designations[1]._id,
//         dateOfJoining: new Date("2024-04-01"),
//         employeeId: "EMP006",
//         status: "active",
//       },
//     ];

//     for (const employee of dummyEmployees) {
//       await Employee.updateOne(
//         {  employeeId: employee.employeeId },
//         { $setOnInsert: employee },
//         { upsert: true }
//       );
//     }

//     const employeeCount = await Employee.countDocuments();
//     console.log(`✅ Employees Ready (${employeeCount})\n`);

//     // ===============================
//     // LOGIN INFO
//     // ===============================
//     console.log("🔐 Login Credentials (Password: Password@123)\n");
//     console.log("Admin:     admin@company.com");
//     console.log("Manager 1: manager1@company.com");
//     console.log("Manager 2: manager2@company.com");
//     console.log("Employee 1: employee1@company.com");
//     console.log("Employee 2: employee2@company.com");
//     console.log("Employee 3: employee3@company.com");

//     await mongoose.connection.close();
//     console.log("\n✅ Seeding Completed Successfully\n");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Seeding Failed:", error);
//     process.exit(1);
//   }
// };

// seedDatabase();