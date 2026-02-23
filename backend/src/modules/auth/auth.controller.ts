import { Request, Response } from "express";
import loginService from "./auth.service";
import { ApiResponse } from "../../common/utils/ApiResponse";

const authController = async (req : Request, res : Response, next: any) => {
    try{
        const result = await loginService(req.body);
        return ApiResponse.sendSuccess(res, 200, "Login successful", result);
    }catch(error){
        next(error);
    }
}
export default authController;
  