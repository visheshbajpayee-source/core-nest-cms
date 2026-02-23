import bcrypt from "bcrypt";
import { Employee } from "../employees/employee.model";
import { generateToken } from "../../config/jwt";
import { LoginDto, AuthResponseDto } from "./auth.types";

export const login = async (
  data: LoginDto
): Promise<AuthResponseDto> => {

  const { email, password } = data;

  const employee = await Employee
    .findOne({ email })
    .select("+password");

  if (!employee) {
    throw new Error("Invalid email or password");
  }

  if (employee.status !== "active") {
    throw new Error("Your account is inactive. Contact admin.");
  }

  const isMatch = await bcrypt.compare(
    password,
    employee.password
  );

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    id: employee._id.toString(),
    role: employee.role,
  });

  return {
    token,
    user: {
      id: employee._id.toString(),
      fullName: employee.fullName,
      email: employee.email,
      role: employee.role,
    },
  };
};