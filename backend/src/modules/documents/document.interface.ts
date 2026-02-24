import { Document } from "mongoose";

export interface IDocument extends Document {
  employee: string; // ref Employee
  documentName: string;
  documentType: "offer_letter" | "id_proof" | "address_proof" | "certificate" | "contract" | "payslip" | "other";
  filePath: string;  // stored path relative to /uploads
  mimeType: string;
  fileSize: number;
  uploadedBy: string; // ref Employee (admin who uploaded)
  uploadDate: Date;
  notes?: string;
}
