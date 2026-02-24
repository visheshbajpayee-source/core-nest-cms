/**
 * Custom API Error Class
 * Handles all API error responses with consistent format
 */
export class ApiError extends Error {
  statusCode: number;
  errors?: any[];
  data?: any;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Common error factory methods
   */
  static badRequest(message: string = "Bad Request", errors?: any[]) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "Access forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message: string = "Resource already exists") {
    return new ApiError(409, message);
  }

  static unprocessable(message: string = "Unprocessable entity", errors?: any[]) {
    return new ApiError(422, message, errors);
  }

  static internalServer(message: string = "Internal server error") {
    return new ApiError(500, message);
  }

  static serviceUnavailable(message: string = "Service unavailable") {
    return new ApiError(503, message);
  }
}

/**
 * Predefined error messages for common scenarios
 */
export const ErrorMessages = {
  // Authentication errors
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_EXPIRED: "Token has expired",
  INVALID_TOKEN: "Invalid or malformed token",
  TOKEN_MISSING: "Authorization token is missing",
  
  // Authorization errors
  ACCESS_DENIED: "You do not have permission to access this resource",
  ADMIN_ONLY: "This action requires admin privileges",
  
  // Resource errors
  USER_NOT_FOUND: "User not found",
  EMPLOYEE_NOT_FOUND: "Employee not found",
  DEPARTMENT_NOT_FOUND: "Department not found",
  DESIGNATION_NOT_FOUND: "Designation not found",
  LEAVE_NOT_FOUND: "Leave request not found",
  PROJECT_NOT_FOUND: "Project not found",
  TASK_NOT_FOUND: "Task not found",
  WORKLOG_NOT_FOUND: "Worklog not found",
  
  // Validation errors
  INVALID_EMAIL: "Invalid email format",
  INVALID_PASSWORD: "Password does not meet requirements",
  PASSWORDS_MISMATCH: "Passwords do not match",
  EMAIL_ALREADY_EXISTS: "Email is already registered",
  DUPLICATE_ENTRY: "This record already exists",
  
  // Business logic errors
  INSUFFICIENT_LEAVE_BALANCE: "Insufficient leave balance",
  INVALID_DATE_RANGE: "Start date must be before end date",
  FUTURE_DATE_REQUIRED: "Date must be in the future",
  
  // Server errors
  DATABASE_ERROR: "Database operation failed",
  INTERNAL_ERROR: "An unexpected error occurred",
  SERVICE_UNAVAILABLE: "Service is temporarily unavailable",
};

/**
 * Error status codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
