import express, { Router } from "express";
import { createEmployee } from "./employee.controller";

const userRouter: Router = express.Router();

userRouter.post('/register', createEmployee);
userRouter.get('/register', createEmployee);


export default userRouter;  