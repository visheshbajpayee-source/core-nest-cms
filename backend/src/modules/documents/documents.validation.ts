import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/i, "Invalid identifier format");

const documentTypeSchema = z.enum([
  "id_proof",
  "offer_letter",
  "certificate",
  "other",
]);

export const createDocumentSchema = z.object({
  employeeId: objectIdSchema,
  documentName: z
    .string()
    .min(2, "Document name must be at least 2 characters")
    .max(150, "Document name must be at most 150 characters"),
  documentType: documentTypeSchema,
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name is too long"),
  mimeType: z
    .string()
    .min(3, "MIME type is required")
    .max(100, "MIME type is too long"),
  fileContentBase64: z
    .string()
    .min(1, "File content is required")
    .max(10_000_000, "Encoded file payload is too large"),
});

export const updateDocumentSchema = z
  .object({
    documentName: z
      .string()
      .min(2, "Document name must be at least 2 characters")
      .max(150, "Document name must be at most 150 characters")
      .optional(),
    documentType: documentTypeSchema.optional(),
  })
  .refine(
    (value) =>
      typeof value.documentName !== "undefined" ||
      typeof value.documentType !== "undefined",
    {
      message: "At least one field must be provided for update",
    }
  );
