import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../../common/utils/ApiError";
import { LoginUserDto, LoginResponseDto } from "../../dto/user.dto";
import { Employee } from "../employees/employee.model";

const authService = async (data: LoginUserDto): Promise<LoginResponseDto> => {
    // Find user and include password for verification
    const user = await Employee.findOne({ email: data.email }).select("+password");

    if (!user) {
        throw ApiError.unauthorized("Invalid email or password");
    }

    // Verify password
    // const isMatch = await bcrypt.compare(data.password, (user as any).password || "");
    // if (!isMatch) {
    //     console.log(`recieved password: ${data.password}, stored hash: ${(user as any).password}`);
    //     throw ApiError.unauthorized("Invalid email or password");
    // }
    if(user.password !== data.password){
        console.log(`recieved password: ${data.password}, stored hash: ${(user as any).password}`);
        throw ApiError.unauthorized("Invalid email or password");
    }

    // Generate JWT
    const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

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
