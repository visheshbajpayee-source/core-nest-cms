// // // import { Router } from "express";
// // // import {protect} from "../../common/middlewares/auth.middleware";
// // // import {authorize} from "../../common/middlewares/role.middleware";
// // // import { validate } from "../../common/middlewares/validate.middleware";

// // import {
// //   getMyAttendanceController,
// //   getAttendanceController,
// //   updateAttendanceController,
// //   addAttendance,
// // } from "./attendance.controller";

// // import { updateAttendanceSchema } from "./attendance.validation";

// // const router: Router = Router();

// // /**
// //  * GET /api/v1/attendance/me
// //  * Logged-in user can view their own attendance
// //  */
// // router.get(
// //   "/me",
// //   protect,
// //   getMyAttendanceController
// // );

// // /**
// //  * GET /api/v1/attendance
// //  * Admin and Manager can view attendance
// //  */
// // router.get(
// //   "/",
// //   protect,
// //   authorize("admin", "manager"),
// //   getAttendanceController
// // );

// // /**
// //  * PATCH /api/v1/attendance/:id
// //  * Admin can manually update attendance
// //  */
// // router.patch(
// //   "/:id",
// //   protect,
// //   authorize("admin"),
// //   validate(updateAttendanceSchema),
// //   updateAttendanceController
// // );
// // /**
// //  * PATCH /api/v1/attendance/:id
// //  * Admin can manually update attendance
// //  */
// // router.post(
// //   "/",
// //   protect,
// //   authorize("admin"),
// //   validate(updateAttendanceSchema),
// //   addAttendance
// // );

// // export default router;
// // import { Router, Request, Response, NextFunction } from "express";
// // import { Attendance } from "./attendance.model";
// // import { ApiResponse } from "../../common/utils/ApiResponse";
// // import { ApiError } from "../../common/utils/ApiError";
// // import { protect } from "../../common/middlewares/auth.middleware";
// // import { authorize } from "../../common/middlewares/role.middleware";

// // const router: Router = Router();

// // // GET all attendance records (admin = all, manager = their dept)
// // router.get("/", protect, authorize("admin", "manager"), async (req: Request, res: Response, next: NextFunction) => {
// //   try {
// //     const user = (req as any).user;
// //     const { employeeId, date, status, month, year } = req.query;

// //     const query: any = {};
// //     if (status) query.status = status;

// //     // Filter by date or month+year
// //     if (date) {
// //       const d = new Date(date as string);
// //       query.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
// //     } else if (month && year) {
// //       const m = Number(month) - 1;
// //       const y = Number(year);
// //       query.date = { $gte: new Date(y, m, 1), $lte: new Date(y, m + 1, 0, 23, 59, 59) };
// //     }

// //     const records = await Attendance.find(query)
// //       .populate("employee", "fullName email employeeId department role")
// //       .sort({ date: -1 })
// //       .lean();

// //     // If manager, filter by their department
// //     let result = records;
// //     if (user?.role === "manager") {
// //       result = records.filter((r: any) => {
// //         return r.employee?.department?.toString() === user.department?.toString();
// //       });
// //     }

// //     // If specific employee filter
// //     if (employeeId) {
// //       result = result.filter((r: any) => r.employee?.employeeId === employeeId);
// //     }

// //     return ApiResponse.sendSuccess(res, 200, "Attendance records fetched", result);
// //   } catch (e) { next(e); }
// // });

// // // GET my attendance (employee)
// // router.get("/me", protect, async (req: Request, res: Response, next: NextFunction) => {
// //   try {
// //     const user = (req as any).user;
// //     const { month, year } = req.query;
// //     const query: any = { employee: user.mongoId || user.id };

// //     if (month && year) {
// //       const m = Number(month) - 1;
// //       const y = Number(year);
// //       query.date = { $gte: new Date(y, m, 1), $lte: new Date(y, m + 1, 0, 23, 59, 59) };
// //     }

// //     const records = await Attendance.find(query).sort({ date: -1 }).lean();
// //     return ApiResponse.sendSuccess(res, 200, "My attendance fetched", records);
// //   } catch (e) { next(e); }
// // });

// // // POST manually create/correct attendance (admin only)
// // router.post("/", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
// //   try {
// //     const { employee, date, status, checkInTime } = req.body;
// //     if (!employee || !date || !status) throw ApiError.badRequest("employee, date and status are required");

// //     const d = new Date(date);
// //     d.setHours(0, 0, 0, 0);

// //     const record = await Attendance.findOneAndUpdate(
// //       { employee, date: d },
// //       { employee, date: d, status, checkInTime: checkInTime ? new Date(checkInTime) : undefined },
// //       { upsert: true, new: true, runValidators: true }
// //     );
// //     return ApiResponse.sendSuccess(res, 201, "Attendance record saved", record);
// //   } catch (e) { next(e); }
// // });

// // // PUT update attendance record (admin only)
// // router.put("/:id", protect, authorize("admin"), async (req: Request, res: Response, next: NextFunction) => {
// //   try {
// //     const { status, checkInTime } = req.body;
// //     const record = await Attendance.findByIdAndUpdate(
// //       req.params.id,
// //       { status, checkInTime: checkInTime ? new Date(checkInTime) : undefined },
// //       { new: true, runValidators: true }
// //     );
// //     if (!record) throw ApiError.notFound("Attendance record not found");
// //     return ApiResponse.sendSuccess(res, 200, "Attendance updated", record);
// //   } catch (e) { next(e); }
// // });

// // export default router;






// // 
// import { Router } from "express";
// import {protect} from "../../common/middlewares/auth.middleware";
// import {authorize} from "../../common/middlewares/role.middleware";
// import { validate } from "../../common/middlewares/validate.middleware";

// import {
//   getMyAttendanceController,
//   getAttendanceController,
//   updateAttendanceController,
//   checkoutAttendanceController,
//   getMonthlySummaryController,
// } from "./attendance.controller";

// import { updateAttendanceSchema } from "./attendance.validation";

// const router: Router = Router();

// /**
//  * GET /api/v1/attendance/me
//  * Logged-in user can view their own attendance
//  */
// router.get("/me", protect, getMyAttendanceController);
// router.get(
//   "/summary",
//   protect,
//   getMonthlySummaryController
// );
// /**
//  * GET /api/v1/attendance
//  * Admin & Manager can view attendance
//  */
// router.get(
//   "/",
//   protect,
//   authorize("admin", "manager"),
//   getAttendanceController
// );
// /**
//  * PATCH /api/v1/attendance/:id
//  * Admin can manually update attendance
//  */
// router.patch(
//   "/:id",
//   protect,
//   authorize("admin"),
//   validate(updateAttendanceSchema),
//   updateAttendanceController
// );

// /**
//  * POST /api/v1/attendance/checkout
//  * Logged-in user checkout
//  */
// router.post(
//   "/checkout",
//   protect,
//   checkoutAttendanceController
// );

// export default router;



// 
import { Router } from "express";
import {protect} from "../../common/middlewares/auth.middleware";
import {authorize} from "../../common/middlewares/role.middleware";
import { validate } from "../../common/middlewares/validate.middleware";

import {
  getMyAttendanceController,
  getAttendanceController,
  updateAttendanceController,
  checkoutAttendanceController,
  getMonthlySummaryController,
} from "./attendance.controller";

import { updateAttendanceSchema } from "./attendance.validation";

const router: Router = Router();

/**
 * GET /api/v1/attendance/me
 * Logged-in user can view their own attendance
 */
router.get("/me", protect, getMyAttendanceController);
router.get(
  "/summary",
  protect,
  getMonthlySummaryController
);
/**
 * GET /api/v1/attendance
 * Admin & Manager can view attendance
 */
router.get(
  "/",
  protect,
  authorize("admin", "manager"),
  getAttendanceController
);
/**
 * PATCH /api/v1/attendance/:id
 * Admin can manually update attendance
 */
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateAttendanceSchema),
  updateAttendanceController
);

/**
 * POST /api/v1/attendance/checkout
 * Logged-in user checkout
 */
router.post(
  "/checkout",
  protect,
  checkoutAttendanceController
);

export default router;
