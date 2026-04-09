import { Document, Types } from "mongoose";

export type DocumentType = "id_proof" | "offer_letter" | "certificate" | "other";

export interface IDocument extends Document {
  employee: Types.ObjectId;
  documentName: string;
  documentType: DocumentType;
  fileName: string;
  /**
   * Raw file content stored in MongoDB as a Buffer
   */
  fileData: Buffer;
  mimeType: string;
  fileSize: number;
  uploadedBy: Types.ObjectId;
  uploadDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
