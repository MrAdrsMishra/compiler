import {
  validateCodeSubmission,
  checkRateLimit,
  MAX_CODE_SIZE_BYTES,
  MAX_STDIN_SIZE_BYTES,
} from "../src/security/maliciousCodeGuard.js";

let passed = 0;
let failed = 0;

function assert(cond, label) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.error(`  ❌ ${label}`);
  }
}

/* ---------- 1. Benign code should pass ---------- */
console.log("\n[1] Benign submissions (should be safe)");
const benign = [
  ["cpp", '#include <iostream>\nint main(){ std::cout << "hi"; return 0; }'],
  ["c", '#include <stdio.h>\nint main(){ printf("hi"); return 0; }'],
  ["python", 'print("hello world")'],
  ["python", 'n = int(input())\nprint(n + 1)'],
  ["java", 'public class Main { public static void main(String[] a){ System.out.println("hi"); } }'],
  ["javascript", 'console.log("hi");'],
  ["typescript", 'const x: number = 1; console.log(x);'],
  ["go", 'package main\nimport "fmt"\nfunc main(){ fmt.Println("hi") }'],
  ["rust", 'fn main(){ println!("hi"); }'],
  ["ruby", 'puts "hi"'],
  ["php", '<?php echo "hi";'],
  ["kotlin", 'fun main() { println("hi") }'],
  ["swift", 'print("hi")'],
  ["r", 'cat("hi")'],
  ["bash", 'echo "hi"'],
  ["csharp", 'using System; class P { static void Main(){ Console.WriteLine("hi"); } }'],
];
for (const [lang, code] of benign) {
  const r = validateCodeSubmission({ code, stdin: "", fileName: "", language: lang });
  assert(r.safe === true, `${lang}: benign code passed`);
}

/* ---------- 2. Malicious patterns ---------- */
console.log("\n[2] Malicious submissions (must be blocked)");
const malicious = [
  ["python", 'import os\nos.system("rm -rf /")', "os.system"],
  ["python", 'import socket\ns = socket.socket()', "socket import"],
  ["python", 'eval("__import__(os).system(1)")', "eval"],
  ["cpp", 'system("curl http://evil.com")', "system() in cpp"],
  ["c", 'fork();', "fork() in c"],
  ["cpp", 'int s = socket(AF_INET, SOCK_STREAM, 0);', "socket() in cpp"],
  ["java", 'Runtime.getRuntime().exec("rm -rf /")', "Runtime.exec in java"],
  ["java", 'new ProcessBuilder("sh").start()', "ProcessBuilder in java"],
  ["java", 'System.exit(0)', "System.exit in java"],
  ["javascript", 'require("child_process").execSync("whoami")', "child_process in js"],
  ["javascript", 'import fs from "fs"', "fs import in js"],
  ["bash", 'rm -rf /', "rm -rf in bash"],
  ["bash", 'while :; do : | : & done', "fork bomb in bash"],
  ["go", 'syscall.Exec("rm", nil)', "go exec"],
];
for (const [lang, code, what] of malicious) {
  const r = validateCodeSubmission({ language: lang, code, stdin: "", fileName: "" });
  assert(r.safe === false, `${lang}: blocked ${what}`);
}

/* ---------- 3. Oversized payloads ---------- */
console.log("\n[3] Payload size enforcement");
{
  const big = "a".repeat(MAX_CODE_SIZE_BYTES + 1);
  const r = validateCodeSubmission({ language: "python", code: big });
  assert(r.safe === false && r.reason.includes("Code size"), "code > 64KB blocked");
}
{
  const big = "a".repeat(MAX_STDIN_SIZE_BYTES + 1);
  const r = validateCodeSubmission({ language: "python", code: "x=1", stdin: big });
  assert(r.safe === false && r.reason.includes("Stdin"), "stdin >32KB blocked");
}

/* ---------- 4. File name traversal / disallowed ext ---------- */
console.log("\n[4] File name validation");
{
  const r = validateCodeSubmission({
    language: "python",
    code: "print(1)",
    fileName: "../../etc/passwd",
  });
  assert(r.safe === false, "traversal '../..' blocked");
}
{
  const r = validateCodeSubmission({
    language: "python",
    code: "print(1)",
    fileName: "evil.sh",
  });
  assert(r.safe === false, "disallowed .sh extension blocked");
}
{
  const r = validateCodeSubmission({
    language: "python",
    code: "print(1)",
    fileName: "main.py",
  });
  assert(r.safe === true, "valid main.py accepted");
}

/* ---------- 5. Rate limiter ---------- */
console.log("\n[5] Rate limiter (sliding window)");
{
  const ip = "203.0.113.99";
  for (let i = 0; i < 3; i++) {
    const r = checkRateLimit(ip, 3, 60000);
    assert(r.allowed === true, `request ${i + 1} allowed`);
  }
  const blocked = checkRateLimit(ip, 3, 60000);
  assert(blocked.allowed === false && blocked.retryAfterSec > 0, `request 4 blocked (retry-after=${blocked.retryAfterSec}s)`);
  const other = checkRateLimit("198.51.100.77", 3, 60000);
  assert(other.allowed === true, "different IP unaffected");
}

console.log(`\n==============================`);
console.log(`GUARD TESTS: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);