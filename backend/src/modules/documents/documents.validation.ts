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
  employeeId: z.string(),
  documentName: z.string().min(2).max(150),
  documentType: z.enum(["id_proof", "offer_letter", "certificate", "other"]),
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
