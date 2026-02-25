import mongoose, { Schema } from "mongoose";
import { IDocument } from "./document.interface";

const DocumentSchema = new Schema<IDocument>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    documentName: { type: String, required: true, trim: true },
    documentType: {
      type: String,
      enum: ["offer_letter", "id_proof", "address_proof", "certificate", "contract", "payslip", "other"],
      required: true,
    },
    filePath: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    uploadDate: { type: Date, default: Date.now },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

DocumentSchema.index({ employee: 1 });
DocumentSchema.index({ documentType: 1 });

export const DocumentModel = mongoose.model<IDocument>("Document", DocumentSchema);
