import mongoose from "mongoose";
import dotenv from "dotenv";
import { LeaveType } from "../modules/leaveTypes/leaveType.model";

dotenv.config();

/**
 * Script to fix leave types and ensure proper leave types exist
 * Run with: npx ts-node src/scripts/fixLeaveTypes.ts
 */

const fixLeaveTypes = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected\n");

    // First, check for existing leave types
    console.log("📋 Checking existing leave types...");
    const existingTypes = await LeaveType.find({});
    
    console.log(`Found ${existingTypes.length} leave types:`);
    existingTypes.forEach((type) => {
      console.log(`  - ${type.name} (${type.code}) - ${type.maxDaysPerYear} days/year - Active: ${type.isActive}`);
    });
    console.log();

    // Define the desired leave types
    const desiredLeaveTypes = [
      {
        name: "Casual Leave",
        code: "CASUAL",
        maxDaysPerYear: 12,
        isActive: true,
      },
      {
        name: "Sick Leave",
        code: "SICK",
        maxDaysPerYear: 10,
        isActive: true,
      },
      {
        name: "Earned Leave",
        code: "EARNED",
        maxDaysPerYear: 15,
        isActive: true,
      },
    ];

    // Remove duplicate "Sick Leave" entries (keep only one)
    console.log("🔍 Checking for duplicate Sick Leave entries...");
    const sickLeaves = await LeaveType.find({ 
      $or: [
        { code: "SICK" },
        { name: /sick/i }
      ]
    });

    if (sickLeaves.length > 1) {
      console.log(`⚠️  Found ${sickLeaves.length} Sick Leave entries. Keeping the first one and removing duplicates...`);
      
      // Keep the first one, delete the rest
      for (let i = 1; i < sickLeaves.length; i++) {
        await LeaveType.findByIdAndDelete(sickLeaves[i]._id);
        console.log(`   ❌ Deleted duplicate: ${sickLeaves[i].name} (${sickLeaves[i].code})`);
      }
    } else {
      console.log("   ✅ No duplicate Sick Leave entries found");
    }
    console.log();

    // Ensure all desired leave types exist
    console.log("🔧 Ensuring standard leave types exist...");
    
    for (const leaveTypeData of desiredLeaveTypes) {
      const existing = await LeaveType.findOne({ code: leaveTypeData.code });
      
      if (!existing) {
        const created = await LeaveType.create(leaveTypeData);
        console.log(`   ✅ Created: ${created.name} (${created.code})`);
      } else {
        // Update existing if needed
        await LeaveType.findByIdAndUpdate(
          existing._id,
          {
            name: leaveTypeData.name,
            maxDaysPerYear: leaveTypeData.maxDaysPerYear,
            isActive: true,
          },
          { new: true }
        );
        console.log(`   ✅ Updated: ${leaveTypeData.name} (${leaveTypeData.code})`);
      }
    }

    console.log();
    console.log("📊 Final leave types:");
    const finalTypes = await LeaveType.find({ isActive: true }).sort({ name: 1 });
    finalTypes.forEach((type) => {
      console.log(`  - ${type.name} (${type.code}) - ${type.maxDaysPerYear} days/year`);
    });

    console.log("\n✅ Leave types fixed successfully!");
    
  } catch (error) {
    console.error("❌ Error fixing leave types:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB Disconnected");
    process.exit(0);
  }
};

// Run the script
fixLeaveTypes();
