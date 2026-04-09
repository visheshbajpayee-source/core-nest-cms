export type DocumentType = "id_proof" | "offer_letter" | "certificate" | "other";

export interface CreateDocumentDto {
  employeeId: string;
  documentName: string;
  documentType: DocumentType;
  fileName: string;
  mimeType: string;
  fileContentBase64: string;
}

export interface UpdateDocumentDto {
  documentName?: string;
  documentType?: DocumentType;
}

export interface DocumentResponseDto {
  id: string;
  employeeId: string;
  documentName: string;
  documentType: DocumentType;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
