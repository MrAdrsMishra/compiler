import axios from "axios";
import path from "path";
import { validateCodeSubmission, checkRateLimit } from "../security/maliciousCodeGuard.js";

const EXTENSIONS = {
  c: "c",
  cpp: "cpp",
  python: "py",
  go: "go",
  golang: "go",
  rust: "rs",
  javascript: "js",
  typescript: "ts",
  java: "java",
  csharp: "cs",
  php: "php",
  ruby: "rb",
  kotlin: "kt",
  swift: "swift",
  r: "r",
  bash: "sh",
};

const JUDGE0_LANG_IDS = {
  c: 50,
  cpp: 54,
  python: 71,
  java: 62,
  javascript: 63,
  typescript: 74,
  go: 60,
  rust: 73,
  csharp: 51,
  php: 68,
  ruby: 72,
  kotlin: 78,
  swift: 83,
  bash: 46,
  r: 80,
};

const APPROX_MEMORY_USAGE_MB = {
  c: 3,
  cpp: 4,
  python: 14,
  javascript: 28,
  typescript: 32,
  go: 12,
  rust: 8,
  java: 38,
  kotlin: 48,
  csharp: 40,
  php: 14,
  ruby: 18,
  swift: 32,
  r: 30,
  bash: 3,
  default: 15,
};

function estimateMemoryUsage(language, codeLength = 0) {
  const baseMb = APPROX_MEMORY_USAGE_MB[language] || APPROX_MEMORY_USAGE_MB.default;
  const estimatedMb = baseMb + Math.floor(codeLength / 10240);
  return `~${estimatedMb} MB`;
}

// 1. Primary Service: Custom Docker Runner Container
async function executePrimaryRunner(selectedLanguage, userCode, userInput, fileName) {
  const runnerRequestTimeout = parseInt(process.env.RUNNER_REQUEST_TIMEOUT_MS, 10) || 15000;
  const runnerUrl = process.env.RUNNER_URL || "http://localhost:4000";

  const response = await axios.post(
    `${runnerUrl}/run`,
    { selectedLanguage, userCode, userInput, fileName },
    { timeout: runnerRequestTimeout }
  );

  const runnerData = response.data;
  return {
    stdout: runnerData.output,
    stderr: runnerData.error,
    compile_output: runnerData.verdict === "COMPILE_ERROR" ? runnerData.error : null,
    time: runnerData.time ?? null,
    memory: runnerData.memory ?? null,
    service: "custom-runner",
  };
}

// 2. Fallback Tier 1: OneCompiler API
async function executeOneCompilerFallback(selectedLanguage, userCode, userInput, fileName) {
  const ext = EXTENSIONS[selectedLanguage] || "txt";
  const defaultName = selectedLanguage === "java" ? "Main.java" : selectedLanguage === "cpp" ? "Main.cpp" : `main.${ext}`;
  const effectiveFileName = fileName ? path.basename(fileName) : defaultName;

  const response = await axios.post(
    "https://onecompiler.com/api/console/run",
    {
      language: selectedLanguage,
      files: [
        {
          name: effectiveFileName,
          content: userCode,
        },
      ],
      stdin: userInput,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    }
  );

  const data = response.data;
  if (data && typeof data === "object" && data.type === "error") {
    throw new Error(data.message || "OneCompiler execution error");
  }

  let stdout = "";
  let stderr = "";
  let exception = "";
  let executionTime = null;

  if (typeof data === "string") {
    const lines = data.split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.type === "stdout") stdout += parsed.data || "";
        if (parsed.type === "stderr") stderr += parsed.data || "";
        if (parsed.type === "exception") exception += parsed.data || "";
        if (parsed.type === "exit" && parsed.executionTime != null) {
          executionTime = `${(parsed.executionTime / 1000).toFixed(2)}s`;
        }
      } catch {
        stdout += line + "\n";
      }
    }
  } else if (typeof data === "object" && data !== null) {
    stdout = data.stdout || data.output || "";
    stderr = data.stderr || data.error || "";
    exception = data.exception || "";
    if (data.executionTime) {
      executionTime = `${(data.executionTime / 1000).toFixed(2)}s`;
    }
  }

  const combinedError = [stderr, exception].filter(Boolean).join("\n").trim() || null;

  return {
    stdout: stdout.trim() || null,
    stderr: combinedError,
    compile_output: exception ? exception.trim() : null,
    time: executionTime,
    memory: estimateMemoryUsage(selectedLanguage, (userCode || "").length),
    service: "onecompiler",
  };
}

// 3. Fallback Tier 2: Judge0 CE API
async function executeJudge0Fallback(selectedLanguage, userCode, userInput) {
  const languageId = JUDGE0_LANG_IDS[selectedLanguage] || 54;

  const response = await axios.post(
    "https://ce.judge0.com/submissions?wait=true",
    {
      language_id: languageId,
      source_code: userCode,
      stdin: userInput,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    }
  );

  const data = response.data;
  const timeFormatted = data.time ? `${data.time}s` : null;

  return {
    stdout: data.stdout ? data.stdout.trim() : null,
    stderr: data.stderr ? data.stderr.trim() : null,
    compile_output: data.compile_output ? data.compile_output.trim() : null,
    time: timeFormatted,
    memory: data.memory ? `${Math.round(data.memory / 1024)}MB` : null,
    service: "judge0",
  };
}

export const runCode = async (req, res) => {
  const { selectedLanguage = "", userCode = "", userInput = "", fileName = "", customFileName = "" } = req.body;
  const normalizedLang = String(selectedLanguage).trim().toLowerCase();
  const effectiveFileName = String(fileName || customFileName || "").trim();

  // Security Gateway - Step 1a: per-IP rate limiting (second layer; route middleware is the first)
  const clientIp = String(
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.ip ||
    req.socket?.remoteAddress ||
    "unknown"
  );
  const rateLimit = checkRateLimit(
    clientIp,
    parseInt(process.env.GATEWAY_RATE_LIMIT, 10) || 30,
    parseInt(process.env.GATEWAY_RATE_WINDOW_MS, 10) || 60000
  );
  if (!rateLimit.allowed) {
    return res
      .status(429)
      .set("Retry-After", String(rateLimit.retryAfterSec))
      .json({
        success: false,
        verdict: "RATE_LIMITED",
        error: `Rate limit exceeded. Please retry in ${rateLimit.retryAfterSec} second(s).`,
      });
  }

  // Security Gateway Layer 1b: validate code/stdin/file-name before reaching any runner
  const securityCheck = validateCodeSubmission({
    code: userCode,
    stdin: userInput,
    fileName: effectiveFileName,
    language: normalizedLang,
  });
  if (!securityCheck.safe) {
    console.warn(`[GATEWAY SECURITY] Blocked submission from ${clientIp}: ${securityCheck.reason}`);
    return res.status(400).json({
      success: false,
      verdict: "SECURITY_VIOLATION",
      error: securityCheck.reason,
    });
  }

  // Step 1: Try Primary Custom Runner
  try {
    const result = await executePrimaryRunner(normalizedLang, userCode, userInput, effectiveFileName);
    return res.json({ data: result });
  } catch (primaryErr) {
    console.warn(`Primary runner failed (${primaryErr.message}). Falling back to OneCompiler...`);
  }

  // Step 2: Fallback to OneCompiler API
  try {
    const result = await executeOneCompilerFallback(normalizedLang, userCode, userInput, effectiveFileName);
    return res.json({ data: result });
  } catch (oneCompilerErr) {
    console.warn(`OneCompiler fallback failed (${oneCompilerErr.message}). Falling back to Judge0...`);
  }

  // Step 3: Fallback to Judge0 CE API
  try {
    const result = await executeJudge0Fallback(normalizedLang, userCode, userInput);
    return res.json({ data: result });
  } catch (judge0Err) {
    console.error(`Judge0 fallback failed (${judge0Err.message}).`);
  }

  // All services failed
  return res.status(500).json({
    verdict: "ALL_RUNNERS_FAILED",
    message: "Execution failed on all available services (Custom Container, OneCompiler, Judge0).",
    error: "All code runner services are currently unreachable.",
  });
};

