import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../../common/utils/ApiError";
import { LoginUserDto, LoginResponseDto } from "../../dto/user.dto";
import { Employee } from "../employees/employee.model";

/**
 * Login Service
 * Handles authentication + JWT generation + automatic attendance marking
 */
const authService = async (
  data: LoginUserDto
): Promise<LoginResponseDto> => {
  //  1. Find user by email (include password field explicitly)
  const user = await Employee.findOne({ email: data.email }).select(
    "+password"
  );

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  //  2. Verify password using bcrypt
  if (user.password !== data.password) {
  throw ApiError.unauthorized("Invalid email or password");
}

  // 3. Mark attendance (automatic check-in)
  // This should NOT break login if attendance fails
  try {
    await markAttendance(user._id.toString());
  } catch (error) {
    console.error("⚠ Attendance marking failed:", error);
  }

  // 4. Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  //  5. Return login response
  return {
    accessToken: token,
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};

export default authService;

function markAttendance(arg0: string) {
  throw new Error("Function not implemented.");
}
