import path from "path";

// Maximum limits
export const MAX_CODE_SIZE_BYTES = 64 * 1024; // 64 KB
export const MAX_STDIN_SIZE_BYTES = 32 * 1024; // 32 KB

// Disallowed file extensions for custom file names
const DISALLOWED_EXTENSIONS = new Set([
  ".sh", ".bash", ".exe", ".dll", ".bat", ".cmd", ".ps1", ".vbs", ".pyc", ".so", ".dylib"
]);

// Language specific security patterns (Regex)
const DANGEROUS_PATTERNS = {
  // C / C++
  cpp: [
    { pattern: /\b(system|popen|execve|execvp|execl|execlp|execv|WinExec|ShellExecute)\s*\(/i, reason: "Forbidden system command execution function call." },
    { pattern: /\b(fork|vfork|clone)\s*\(/i, reason: "Forbidden process fork / process creation call." },
    { pattern: /:()\s*{\s*:\s*\|\s*:\s*&\s*}\s*;s*:/i, reason: "Forbidden shell fork bomb pattern." },
    { pattern: /\b(socket|connect|bind|listen|accept)\s*\(/i, reason: "Forbidden network socket operations." },
    { pattern: /["']\s*(\/etc\/passwd|\/etc\/shadow|\/proc\/|C:\\Windows|C:\/Windows)/i, reason: "Access to sensitive system paths is prohibited." },
  ],
  c: [
    { pattern: /\b(system|popen|execve|execvp|execl|execlp|execv|WinExec|ShellExecute)\s*\(/i, reason: "Forbidden system command execution function call." },
    { pattern: /\b(fork|vfork|clone)\s*\(/i, reason: "Forbidden process fork / process creation call." },
    { pattern: /:()\s*{\s*:\s*\|\s*:\s*&\s*}\s*;s*:/i, reason: "Forbidden shell fork bomb pattern." },
    { pattern: /\b(socket|connect|bind|listen|accept)\s*\(/i, reason: "Forbidden network socket operations." },
    { pattern: /["']\s*(\/etc\/passwd|\/etc\/shadow|\/proc\/|C:\\Windows|C:\/Windows)/i, reason: "Access to sensitive system paths is prohibited." },
  ],
  // Python
  python: [
    { pattern: /\b(os\.system|os\.popen|os\.exec|os\.spawn|os\.fork|subprocess\.|pty\.)/i, reason: "Forbidden OS process execution module." },
    { pattern: /\b(socket\.socket|urllib|requests\.|http\.client|ftplib|smtplib)/i, reason: "Forbidden network socket or HTTP client module." },
    { pattern: /\b(__import__\s*\(\s*['"](os|subprocess|socket|pty|ctypes|sys)['"])/i, reason: "Forbidden dynamic import of system module." },
    { pattern: /\b(eval|exec)\s*\(/i, reason: "Dynamic code execution (eval/exec) is restricted." },
    { pattern: /["']\s*(\/etc\/passwd|\/etc\/shadow|\/proc\/|C:\\Windows|C:\/Windows)/i, reason: "Access to sensitive system paths is prohibited." },
  ],
  // Java
  java: [
    { pattern: /\b(Runtime\.getRuntime\(\)\.exec|ProcessBuilder)\b/i, reason: "Forbidden Java Process execution call." },
    { pattern: /\b(java\.net\.Socket|java\.net\.ServerSocket|java\.net\.URL)\b/i, reason: "Forbidden Java network socket or URL connection." },
    { pattern: /\b(System\.exit)\s*\(/i, reason: "Forbidden System.exit call." },
    { pattern: /["']\s*(\/etc\/passwd|\/etc\/shadow|\/proc\/|C:\\Windows|C:\/Windows)/i, reason: "Access to sensitive system paths is prohibited." },
  ],
  // JavaScript / TypeScript
  javascript: [
    { pattern: /\b(child_process|cluster)\b/i, reason: "Forbidden child process module." },
    { pattern: /\b(require\s*\(\s*['"](child_process|fs|net|http|https|dgram|os|cluster)['"])/i, reason: "Forbidden system module import." },
    { pattern: /\b(import\s+.*\s+from\s+['"](child_process|fs|net|http|https|dgram|os|cluster)['"])/i, reason: "Forbidden system module import." },
    { pattern: /\b(eval\s*\(|Function\s*\()/i, reason: "Dynamic code evaluation is restricted." },
  ],
  typescript: [
    { pattern: /\b(child_process|cluster)\b/i, reason: "Forbidden child process module." },
    { pattern: /\b(require\s*\(\s*['"](child_process|fs|net|http|https|dgram|os|cluster)['"])/i, reason: "Forbidden system module import." },
    { pattern: /\b(import\s+.*\s+from\s+['"](child_process|fs|net|http|https|dgram|os|cluster)['"])/i, reason: "Forbidden system module import." },
    { pattern: /\b(eval\s*\(|Function\s*\()/i, reason: "Dynamic code evaluation is restricted." },
  ],
  // Bash / Shell
  bash: [
    { pattern: /:\(\)\s*\{\s*:\s*\|[^}]*:\s*&\s*\}\s*;/i, reason: "Forbidden fork bomb pattern detected." },
    { pattern: /\bwhile\s+:\s*;\s*do\s+[^;]*\||\s*&\s*[^;]*done/i, reason: "Forbidden pipe-loop fork bomb pattern." },
    { pattern: /\b(rm\s+-rf\s+\/|dd\s+if=|mkfs|chmod\s+777\s+\/)/i, reason: "Forbidden destructive system command." },
    { pattern: /\b(nc|netcat|ncat|socat|curl|wget)\b/i, reason: "Forbidden network transfer tool." },
  ],
  // Go
  go: [
    { pattern: /\b(exec\.Command|os\/exec|syscall\.Exec|syscall\.ForkExec|syscall\.StartProcess)\b/i, reason: "Forbidden process execution." },
    { pattern: /\b(net\.(Dial|DialTCP|DialUDP|Listen|ListenTCP|ListenUDP)|http\.(Get|Post|Client))\b/i, reason: "Forbidden network socket operation." },
  ],
  // Rust
  rust: [
    { pattern: /\b(std::process::(Command|Stdio)|Command::new|libc::(system|exec|fork|socket|connect)|nix::(unistd::fork|sys::socket))\b/i, reason: "Forbidden process or libc syscall binding." },
    { pattern: /\b(TcpStream::(connect|bind)|TcpListener::bind|UdpSocket::(bind|connect)|std::net::)\b/i, reason: "Forbidden network socket operation." },
  ],
  // Ruby
  ruby: [
    { pattern: /\b(system\s*\(|exec\s*\(|spawn\s*\(|`[^`]{2,}`)/i, reason: "Forbidden shell/system execution." },
    { pattern: /\b(IO\.popen|Open3\.|Process\.(spawn|exec|fork))/i, reason: "Forbidden process execution." },
    { pattern: /\b(TCPSocket|UDPSocket|UNIXSocket|Net::(HTTP|FTP|SMTP)|Socket\.new)\b/i, reason: "Forbidden network socket operation." },
  ],
  // PHP
  php: [
    { pattern: /\b(system\s*\(|exec\s*\(|passthru\s*\(|shell_exec\s*\(|proc_open\s*\(|popen\s*\()/i, reason: "Forbidden process execution function." },
    { pattern: /\b(fsockopen|stream_socket_client|pfsockopen|curl_\w*)\s*\(/i, reason: "Forbidden network socket operation." },
    { pattern: /\b(eval\s*\(\s*\$)/i, reason: "Dynamic code evaluation is restricted." },
  ],
  // Kotlin
  kotlin: [
    { pattern: /\b(ProcessBuilder\s*\(|Runtime\.getRuntime\(\)\.exec)\b/i, reason: "Forbidden process execution." },
    { pattern: /\bjava\.net\.(Socket|ServerSocket|URL|HttpURLConnection)\b/i, reason: "Forbidden network socket operation." },
  ],
  // Swift
  swift: [
    { pattern: /\b(Process\(|Process\.launchedProcess|system\s*\(|execve\s*\()/i, reason: "Forbidden process execution." },
    { pattern: /\b(URLSession|Network\.NWConnection|NSStream|CFSocket)\b/i, reason: "Forbidden network operation." },
  ],
  // C#
  csharp: [
    { pattern: /\b(System\.Diagnostics\.Process|Process\.Start|ProcessStartInfo)\b/i, reason: "Forbidden process execution." },
    { pattern: /\b(System\.Net\.(Sockets\.(TcpClient|UdpClient|Socket)|Http\.|HttpClient)|WebClient)\b/i, reason: "Forbidden network socket operation." },
  ],
  // R
  r: [
    { pattern: /\b(system\s*\(|system2\s*\(|shell\s*\()/i, reason: "Forbidden shell/system execution." },
    { pattern: /\b(socketConnection|make\.socket|url\s*\(|download\.file\s*\()/i, reason: "Forbidden network operation." },
  ],
  // Common fallback rules for any language
  global: [
    { pattern: /:()\s*\{\s*:\s*\|\s*:\s*&\s*}\s*;?:/i, reason: "Forbidden shell fork bomb pattern." },
    { pattern: /rm\s+-rf\s+[\/\\]/i, reason: "Forbidden destructive file command." },
  ],};

/**
 * Validates incoming code execution request parameters against security rules.
 */
export function validateCodeSubmission({ code = "", stdin = "", fileName = "", language = "" }) {
  const normLang = String(language || "").trim().toLowerCase();

  // 1. Check Code Size
  const codeSizeBytes = Buffer.byteLength(String(code), "utf8");
  if (codeSizeBytes > MAX_CODE_SIZE_BYTES) {
    return {
      safe: false,
      reason: `Code size (${Math.round(codeSizeBytes / 1024)} KB) exceeds maximum allowed limit of ${MAX_CODE_SIZE_BYTES / 1024} KB.`,
    };
  }

  // 2. Check Stdin Size
  const stdinSizeBytes = Buffer.byteLength(String(stdin), "utf8");
  if (stdinSizeBytes > MAX_STDIN_SIZE_BYTES) {
    return {
      safe: false,
      reason: `Stdin input size (${Math.round(stdinSizeBytes / 1024)} KB) exceeds maximum allowed limit of ${MAX_STDIN_SIZE_BYTES / 1024} KB.`,
    };
  }

  // 3. Validate File Name (if provided)
  if (fileName) {
    const sanitized = path.basename(fileName);
    if (sanitized !== fileName || fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return {
        safe: false,
        reason: "Invalid file name: directory traversal characters are prohibited.",
      };
    }

    const ext = path.extname(fileName).toLowerCase();
    if (DISALLOWED_EXTENSIONS.has(ext)) {
      return {
        safe: false,
        reason: `File extension '${ext}' is disallowed for security reasons.`,
      };
    }
  }

  // 4. Static Code Security Analysis
  const langRules = DANGEROUS_PATTERNS[normLang] || [];
  const allRules = [...langRules, ...DANGEROUS_PATTERNS.global];

  for (const { pattern, reason } of allRules) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: `Security Policy Violation: ${reason}`,
      };
    }
  }

  return { safe: true, reason: null };
}

/**
 * In-memory IP Rate Limiter (Sliding Window / Token Bucket)
 */
const rateLimitMap = new Map();

export function checkRateLimit(clientIp, limit = 30, windowMs = 60000) {
  const now = Date.now();
  if (!rateLimitMap.has(clientIp)) {
    rateLimitMap.set(clientIp, []);
  }

  const timestamps = rateLimitMap.get(clientIp);
  // Remove timestamps outside the sliding window
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    rateLimitMap.set(clientIp, validTimestamps);
    return { allowed: false, retryAfterSec: Math.ceil((validTimestamps[0] + windowMs - now) / 1000) };
  }

  validTimestamps.push(now);
  rateLimitMap.set(clientIp, validTimestamps);

  // Periodically clean up old IPs
  if (rateLimitMap.size > 5000) {
    for (const [ip, ts] of rateLimitMap.entries()) {
      if (ts.length === 0 || now - ts[ts.length - 1] > windowMs) {
        rateLimitMap.delete(ip);
      }
    }
  }

  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Express middleware factory that enforces the per-IP sliding window rate limit
 * at the API gateway. Responds with 429 + `Retry-After` when the limit is hit.
 */
export function createRateLimitMiddleware({
  limit = parseInt(process.env.GATEWAY_RATE_LIMIT, 10) || 30,
  windowMs = parseInt(process.env.GATEWAY_RATE_WINDOW_MS, 10) || 60000,
} = {}) {
  return function gatewayRateLimit(req, res, next) {
    const clientIp = String(
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.ip ||
      req.socket?.remoteAddress ||
      "unknown"
    );

    const { allowed, retryAfterSec } = checkRateLimit(clientIp, limit, windowMs);

    if (!allowed) {
      return res
        .status(429)
        .set("Retry-After", String(retryAfterSec))
        .json({
          success: false,
          verdict: "RATE_LIMITED",
          error: `Rate limit exceeded. Please retry in ${retryAfterSec} second(s).`,
        });
    }

    return next();
  };
}
