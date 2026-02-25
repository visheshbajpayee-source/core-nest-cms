import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { ApiError } from "../../common/utils/ApiError";
import {
  CreateDocumentDto,
  DocumentResponseDto,
  UpdateDocumentDto,
} from "../../dto/document.dto";
import { Employee } from "../employees/employee.model";
import { DocumentModel } from "./documents.model";
import { IDocument } from "./documents.interface";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

interface AuthUser {
  id: string;
  role: string;
}

interface DocumentFilters {
  employeeId?: string;
  documentType?: string;
}

const sanitizeFileName = (name: string): string =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

const parseBase64Content = (encoded: string): Buffer => {
  const cleaned = encoded.includes(",") ? encoded.split(",")[1] : encoded;
  if (!cleaned) {
    throw ApiError.badRequest("Invalid file content");
  }
  try {
    return Buffer.from(cleaned, "base64");
  } catch {
    throw ApiError.badRequest("Invalid base64 file content");
  }
};

const ensureEmployeeExists = async (employeeId: string) => {
  const employee = await Employee.findById(employeeId).select("_id department");
  if (!employee) {
    throw ApiError.notFound("Employee not found");
  }
  return employee;
};

const canManagerAccessEmployee = async (
  managerId: string,
  employeeId: string
): Promise<boolean> => {
  const [manager, employee] = await Promise.all([
    Employee.findById(managerId).select("department"),
    Employee.findById(employeeId).select("department"),
  ]);

  if (!manager || !employee) {
    return false;
  }

  return manager.department.toString() === employee.department.toString();
};

const assertAccess = async (doc: IDocument, user: AuthUser): Promise<void> => {
  if (user.role === "admin") {
    return;
  }

  const employeeId = doc.employee.toString();
  if (user.role === "employee") {
    if (employeeId !== user.id) {
      throw ApiError.forbidden("You can only access your own documents");
    }
    return;
  }

  if (user.role === "manager") {
    const allowed = await canManagerAccessEmployee(user.id, employeeId);
    if (!allowed) {
      throw ApiError.forbidden(
        "Managers can only access documents in their department"
      );
    }
    return;
  }

  throw ApiError.forbidden("You do not have permission to access documents");
};

const toResponse = (doc: IDocument): DocumentResponseDto => ({
  id: doc._id.toString(),
  employeeId: doc.employee.toString(),
  documentName: doc.documentName,
  documentType: doc.documentType,
  fileName: doc.fileName,
  mimeType: doc.mimeType,
  fileSize: doc.fileSize,
  fileUrl: `/${doc.filePath.split(path.sep).join("/")}`,
  uploadedBy: doc.uploadedBy.toString(),
  uploadDate: doc.uploadDate,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const saveDocumentFile = async (
  employeeId: string,
  fileName: string,
  content: Buffer
): Promise<string> => {
  const safeName = sanitizeFileName(fileName);
  const uniquePrefix = `${Date.now()}-${randomBytes(6).toString("hex")}`;
  const directory = path.join(process.cwd(), "uploads", "documents", employeeId);
  const absolutePath = path.join(directory, `${uniquePrefix}-${safeName}`);

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(absolutePath, content);

  return path.relative(process.cwd(), absolutePath);
};

export const createDocument = async (
  payload: CreateDocumentDto,
  user: AuthUser
): Promise<DocumentResponseDto> => {
  const owner = await ensureEmployeeExists(payload.employeeId);

  if (user.role === "employee" && payload.employeeId !== user.id) {
    throw ApiError.forbidden("Employees can only upload to their own profile");
  }

  if (user.role === "manager") {
    throw ApiError.forbidden("Managers are not allowed to upload documents");
  }

  if (!ALLOWED_MIME_TYPES.has(payload.mimeType)) {
    throw ApiError.badRequest("Unsupported file type");
  }

  const buffer = parseBase64Content(payload.fileContentBase64);
  if (buffer.length === 0) {
    throw ApiError.badRequest("File content cannot be empty");
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw ApiError.badRequest("File size exceeds 5MB limit");
  }

  const filePath = await saveDocumentFile(payload.employeeId, payload.fileName, buffer);

  const created = await DocumentModel.create({
    employee: owner._id,
    documentName: payload.documentName,
    documentType: payload.documentType,
    fileName: sanitizeFileName(payload.fileName),
    filePath,
    mimeType: payload.mimeType,
    fileSize: buffer.length,
    uploadedBy: user.id,
    uploadDate: new Date(),
  });

  return toResponse(created);
};

export const getDocuments = async (
  user: AuthUser,
  filters: DocumentFilters = {}
): Promise<DocumentResponseDto[]> => {
  const query: Record<string, unknown> = {};

  if (filters.documentType) {
    query.documentType = filters.documentType;
  }

  if (user.role === "admin") {
    if (filters.employeeId) {
      query.employee = filters.employeeId;
    }
  } else if (user.role === "manager") {
    const manager = await Employee.findById(user.id).select("department");
    if (!manager) {
      throw ApiError.forbidden("Manager not found");
    }

    const employees = await Employee.find({ department: manager.department }).select("_id");
    const employeeIds = employees.map((employee) => employee._id);
    query.employee = filters.employeeId
      ? filters.employeeId
      : { $in: employeeIds };

    if (filters.employeeId) {
      const hasAccess = employeeIds.some(
        (employeeId) => employeeId.toString() === filters.employeeId
      );
      if (!hasAccess) {
        throw ApiError.forbidden(
          "Managers can only access documents in their department"
        );
      }
    }
  } else if (user.role === "employee") {
    query.employee = user.id;
  } else {
    throw ApiError.forbidden("Invalid role for document access");
  }

  const docs = await DocumentModel.find(query).sort({ uploadDate: -1 });
  return docs.map(toResponse);
};

export const getDocumentById = async (
  id: string,
  user: AuthUser
): Promise<DocumentResponseDto> => {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw ApiError.notFound("Document not found");
  }

  await assertAccess(doc, user);
  return toResponse(doc);
};

export const updateDocument = async (
  id: string,
  payload: UpdateDocumentDto,
  user: AuthUser
): Promise<DocumentResponseDto> => {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw ApiError.notFound("Document not found");
  }

  await assertAccess(doc, user);

  if (user.role === "manager") {
    throw ApiError.forbidden("Managers cannot modify documents");
  }

  if (payload.documentName) {
    doc.documentName = payload.documentName;
  }
  if (payload.documentType) {
    doc.documentType = payload.documentType;
  }

  await doc.save();
  return toResponse(doc);
};

export const deleteDocument = async (
  id: string,
  user: AuthUser
): Promise<void> => {
  const doc = await DocumentModel.findById(id);
  if (!doc) {
    throw ApiError.notFound("Document not found");
  }

  await assertAccess(doc, user);

  if (user.role === "manager") {
    throw ApiError.forbidden("Managers cannot delete documents");
  }

  const absolutePath = path.join(process.cwd(), doc.filePath);
  await DocumentModel.findByIdAndDelete(id);

  try {
    await fs.unlink(absolutePath);
  } catch {
    // Ignore missing files while metadata delete succeeds.
  }
};
