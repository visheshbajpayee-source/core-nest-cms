import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../../common/middlewares/auth.middleware";
import { authorize } from "../../common/middlewares/role.middleware";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { ApiError } from "../../common/utils/ApiError";
import { DocumentModel } from "./document.model";

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads", "documents");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|doc|docx|jpg|jpeg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext)) return cb(null, true);
    cb(new Error("Only PDF, Word, and image files are allowed"));
  },
});

// GET /documents?employeeId=&documentType= — admin sees all, others see own
router.get("/", protect, async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.user.role === "employee") query.employee = req.user.mongoId || req.user.id;
    if (req.query.employeeId && req.user.role !== "employee") query.employee = req.query.employeeId;
    if (req.query.documentType) query.documentType = req.query.documentType;

    const docs = await DocumentModel.find(query)
      .populate("employee", "fullName employeeId")
      .populate("uploadedBy", "fullName")
      .sort({ uploadDate: -1 });

    ApiResponse.sendSuccess(res, 200, "Documents fetched", docs);
  } catch (e: any) {
    throw ApiError.internalServer(e.message);
  }
});

// POST /documents — admin + manager only
router.post(
  "/",
  protect,
  authorize("admin", "manager"),
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest("No file uploaded");

    const { employeeId, documentName, documentType, notes } = req.body;
    if (!employeeId || !documentName || !documentType) {
      fs.unlinkSync(req.file.path); // clean up
      throw ApiError.badRequest("employeeId, documentName and documentType are required");
    }

    const doc = await DocumentModel.create({
      employee: employeeId,
      documentName,
      documentType,
      filePath: req.file.filename,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.mongoId || req.user.id,
      notes,
    });

    const populated = await doc.populate([
      { path: "employee", select: "fullName employeeId" },
      { path: "uploadedBy", select: "fullName" },
    ]);

    ApiResponse.created("Document uploaded", populated).send(res);
  }
);

// DELETE /documents/:id — admin only
router.delete("/:id", protect, authorize("admin"), async (req: Request, res: Response) => {
  const doc = await DocumentModel.findById(req.params.id);
  if (!doc) throw ApiError.notFound("Document not found");

  // Remove file from disk
  const filePath = path.join(uploadDir, doc.filePath);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await doc.deleteOne();
  ApiResponse.sendSuccess(res, 200, "Document deleted");
});

// GET /documents/:id/download — serve file
router.get("/:id/download", protect, async (req: Request, res: Response) => {
  const doc = await DocumentModel.findById(req.params.id);
  if (!doc) throw ApiError.notFound("Document not found");

  // Employees can only download their own docs
  if (req.user.role === "employee") {
    const empId = String(req.user.mongoId || req.user.id);
    if (String(doc.employee) !== empId) throw ApiError.forbidden("Not authorised");
  }

  const filePath = path.join(uploadDir, doc.filePath);
  if (!fs.existsSync(filePath)) throw ApiError.notFound("File not found on server");

  res.download(filePath, doc.documentName);
});

export default router;
