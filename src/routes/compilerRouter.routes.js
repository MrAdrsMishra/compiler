import { Router } from "express";
import { runCode } from "../service/runCode.service.js";
const compilerRouter = Router();

compilerRouter.route('/run-code').post(runCode)
export default compilerRouter;