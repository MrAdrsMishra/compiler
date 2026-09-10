import { Router } from "express";
import { runCode } from "../service/runCode.service.js";
import { createRateLimitMiddleware } from "../security/maliciousCodeGuard.js";
const compilerRouter = Router();

// Security Gateway: enforce per-IP sliding-window rate limit before any execution
const rateLimitMiddleware = createRateLimitMiddleware({
  limit: parseInt(process.env.GATEWAY_RATE_LIMIT, 10) || 30,
  windowMs: parseInt(process.env.GATEWAY_RATE_WINDOW_MS, 10) || 60000,
});

compilerRouter.route('/run-code').post(rateLimitMiddleware, runCode)
export default compilerRouter;