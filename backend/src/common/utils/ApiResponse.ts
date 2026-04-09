import { Response } from "express";

/**
 * Standard API Response Interface
 */
export interface IApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * API Response helper class
 * Provides consistent response format across the application
 */
export class ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;

  constructor(statusCode: number, message: string = "Success", data: T | null = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data as T;
  }

  /**
   * Send response to client
   */
  send(res: Response) {
    return res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    });
  }

  /**
   * Convert to JSON object
   */
  toJSON(): IApiResponse<T> {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }

  /**
   * Static factory methods for common responses
   */
  static ok<T>(message: string = "Success", data: T | null = null) {
    return new ApiResponse<T>(200, message, data);
  }

  static created<T>(message: string = "Resource created successfully", data: T | null = null) {
    return new ApiResponse<T>(201, message, data);
  }

  static updated<T>(message: string = "Resource updated successfully", data: T | null = null) {
    return new ApiResponse<T>(200, message, data);
  }

  static deleted(message: string = "Resource deleted successfully") {
    return new ApiResponse<null>(200, message, null);
  }

  static noContent(message: string = "No content") {
    return new ApiResponse<null>(204, message, null);
  }

  /**
   * Helper method to send response directly
   */
  static sendSuccess<T>(
    res: Response,
    statusCode: number = 200,
    message: string = "Success",
    data: T | null = null
  ) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  /**
   * Helper method for paginated responses
   */
  static sendPaginated<T>(
    res: Response,
    data: T[],
    {
      page = 1,
      limit = 10,
      total = 0,
      message = "Data fetched successfully",
    }: {
      page?: number;
      limit?: number;
      total?: number;
      message?: string;
    }
  ) {
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}
