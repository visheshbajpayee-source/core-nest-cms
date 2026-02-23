import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError, ErrorMessages } from "../utils/ApiError";
import { Employee } from "../../modules/employees/employee.model";

export const authenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	try {
		const header = req.headers.authorization || req.headers.Authorization;
		if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
			throw ApiError.unauthorized(ErrorMessages?.TOKEN_MISSING || "Authorization token is missing");
		}

		const token = header.split(" ")[1];
		const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;

		if (!payload || !payload.id) {
			throw ApiError.unauthorized("Invalid or malformed token");
		}

		const user = await Employee.findById(payload.id).select("+role department email fullName");
		if (!user) throw ApiError.unauthorized("User not found");

		// attach sanitized user to request
		(req as any).user = {
			id: user._id.toString(),
			role: user.role,
			email: user.email,
			department: user.department,
			fullName: user.fullName,
		};

		next();
	} catch (error: any) {
		next(error);
	}
};

export default authenticate;
