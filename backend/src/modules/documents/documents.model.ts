import { Schema, model } from "mongoose";
import { IDocument } from "./documents.interface";

const documentSchema = new Schema<IDocument>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    documentName: {
      type: String,
      required: true,
      trim: true,
    },
    documentType: {
      type: String,
      enum: ["id_proof", "offer_letter", "certificate", "other"],
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

documentSchema.index({ employee: 1, uploadDate: -1 });

export const DocumentModel = model<IDocument>("Document", documentSchema);
