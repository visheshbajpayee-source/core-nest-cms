import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const authorize = (...allowedRoles: string[]) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const user = (req as any).user;
		if (!user) return next(ApiError.unauthorized());

		if (allowedRoles.length === 0) return next();

		if (!allowedRoles.includes(user.role)) {
			return next(ApiError.forbidden(ApiError.ErrorMessages?.ACCESS_DENIED || "Access denied"));
		}

		next();
	};
};

export default authorize;
