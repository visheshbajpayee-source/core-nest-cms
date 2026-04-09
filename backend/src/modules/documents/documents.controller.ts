import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../common/utils/ApiError";
import { ApiResponse } from "../../common/utils/ApiResponse";
import { AuthRequest } from "../../common/middlewares/auth.middleware";
import { CreateDocumentDto, UpdateDocumentDto } from "../../dto/document.dto";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  getDocumentFileById,
  updateDocument,
} from "./documents.service";

const getUserFromRequest = (req: AuthRequest) => {
  if (!req.user) {
    throw ApiError.unauthorized("User context missing");
  }
  return req.user;
};

export const createDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getUserFromRequest(req as AuthRequest);
    const payload = req.body as CreateDocumentDto;
    const doc = await createDocument(payload, user);
    return ApiResponse.created("Document uploaded", doc).send(res);
  } catch (error) {
    next(error);
  }
};

export const getDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getUserFromRequest(req as AuthRequest);
    const docs = await getDocuments(user, {
      employeeId: req.query.employeeId as string | undefined,
      documentType: req.query.documentType as string | undefined,
    });
    return ApiResponse.sendSuccess(res, 200, "Documents fetched", docs);
  } catch (error) {
    next(error);
  }
};

export const getDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getUserFromRequest(req as AuthRequest);
    const doc = await getDocumentById(req.params.id, user);
    return ApiResponse.sendSuccess(res, 200, "Document fetched", doc);
  } catch (error) {
    next(error);
  }
};

export const updateDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getUserFromRequest(req as AuthRequest);
    const payload = req.body as UpdateDocumentDto;
    const doc = await updateDocument(req.params.id, payload, user);
    return ApiResponse.sendSuccess(res, 200, "Document updated", doc);
  } catch (error) {
    next(error);
  }
};

export const deleteDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getUserFromRequest(req as AuthRequest);
    await deleteDocument(req.params.id, user);
    return ApiResponse.sendSuccess(res, 200, "Document deleted", null);
  } catch (error) {
    next(error);
  }
};

export const downloadDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getUserFromRequest(req as AuthRequest);
    const { buffer, mimeType, fileName } = await getDocumentFileById(
      req.params.id,
      user
    );

    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName.replace(/"/g, '\"')}"`
    );

    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};
