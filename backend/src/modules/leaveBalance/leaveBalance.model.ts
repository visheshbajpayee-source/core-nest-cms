import { Schema, model, Types, Document } from "mongoose";

export interface ILeaveBalance extends Document {
  employee: Types.ObjectId;
  year: number;
  leaveType: string;
  allocated: number;
  used: number;
}

const leaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    year: { type: Number, required: true },
    leaveType: { type: String, required: true, trim: true },
    allocated: { type: Number, required: true, min: 0 },
    used: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// convenience virtual
leaveBalanceSchema.virtual("remaining").get(function (this: ILeaveBalance) {
  return this.allocated - this.used;
});

leaveBalanceSchema.index(
  { employee: 1, year: 1, leaveType: 1 },
  { unique: true }
);

export const LeaveBalance = model<ILeaveBalance>(
  "LeaveBalance",
  leaveBalanceSchema
);
