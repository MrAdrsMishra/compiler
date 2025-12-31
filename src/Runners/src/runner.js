import express from "express";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn, spawnSync } from "child_process";

const app = express();
app.use(express.json());

const PORT = process.env.RUNNER_PORT || 4000;

/* ------------------ CONFIG ------------------ */
const IMAGES = {
  cpp: "mradrsmishra/compiler.com:cpp-runner",
  python: "mradrsmishra/compiler.com:python-runner",
  rust: "mradrsmishra/compiler.com:rust-runner",
  javascript: "mradrsmishra/compiler.com:javascript-runner",
  java: "mradrsmishra/compiler.com:java-runner",
};

const EXTENSIONS = {
  cpp: "cpp",
  python: "py",
  go: "go",
  rust: "rs",
  javascript: "js",
  java: "java",
};

const TIME_LIMIT_MS = 10000;
const OUTPUT_LIMIT = 100_000;

/* ------------------ RUN CODE ------------------ */
app.post("/run", (req, res) => {
  const { selectedLanguage, userCode = "", userInput = "" } = req.body;

  if (!IMAGES[selectedLanguage]) {
    return res.status(400).json({
      success: false,
      verdict: "INVALID_LANGUAGE",
      error: "Unsupported language",
    });
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "judge-"));
  const codeFile = `code.${EXTENSIONS[selectedLanguage]}`;
  const inputFile = "input.txt";

  try {
    fs.writeFileSync(path.join(tempDir, codeFile), userCode);
    fs.writeFileSync(path.join(tempDir, inputFile), userInput);
  } catch {
    cleanup(tempDir);
    return res.status(500).json({ verdict: "FS_ERROR" });
  }

  // Ensure image exists locally; pull synchronously if missing (don't count pull time toward runner timeout)
  const image = IMAGES[selectedLanguage];
  try {
    const inspectRes = spawnSync("docker", ["image", "inspect", image], { stdio: "ignore" });
    if (inspectRes.status !== 0) {
      console.log(`Image ${image} not found locally, pulling...`);
      const pullRes = spawnSync("docker", ["pull", image], { stdio: "inherit" });
      if (pullRes.status !== 0) {
        cleanup(tempDir);
        return res.status(500).json({ verdict: "SYSTEM_ERROR", error: `Failed to pull image ${image}` });
      }
    }
  } catch (err) {
    cleanup(tempDir);
    return res.status(500).json({ verdict: "SYSTEM_ERROR", error: err.message });
  }

  const containerName = `judge-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

  const dockerArgs = [
    "run",
    "--rm",
    "--name",
    containerName,
    "--network=none",
    "--memory=128m",
    "--cpus=0.5",
    "--pids-limit=128",
    "--read-only",
    "--cap-drop=ALL",
    "--security-opt=no-new-privileges",
    "--tmpfs=/tmp:rw,nosuid,exec,size=64m",
    "-v",
    `${tempDir}:/app/work:rw`,
    image,
  ];

  console.log(`Starting container ${containerName} for ${selectedLanguage}`);
  const child = spawn("docker", dockerArgs);

  let stdout = "";
  let stderr = "";
  let verdict = "AC";
  let killed = false;

  const timer = setTimeout(() => {
    // Mark as timed out and attempt to kill the container (safer than killing the docker client process)
    verdict = "TLE";
    killed = true;
    const killer = spawn("docker", ["kill", containerName]);
    killer.on("error", () => {});
    killer.on("close", () => {});
  }, TIME_LIMIT_MS);

  child.stdout.on("data", d => {
    stdout += d.toString().slice(0, OUTPUT_LIMIT - stdout.length);
  });

  child.stderr.on("data", d => {
    stderr += d.toString().slice(0, OUTPUT_LIMIT - stderr.length);
  });

  child.on("close", (code, signal) => {
    console.log(`Container ${containerName} exited with code=${code} signal=${signal}`);
    clearTimeout(timer);
    cleanup(tempDir);

    // Timeout takes precedence
    if (killed) verdict = "TLE";
    else if (code !== 0) {
      const out = stdout.trim();
      // Heuristic: if program printed compiler-like errors to stdout, treat as compile error
      if (out && (out.toLowerCase().includes("error") || out.includes("panic") || out.includes("undefined reference"))) {
        verdict = "COMPILE_ERROR";
      } else {
        verdict = "RUNTIME_ERROR";
      }
    } else if (stderr.trim()) verdict = "RUNTIME_ERROR";

    res.json({
      success: verdict === "AC",
      verdict,
      output: stdout.trim() || null,
      error: stderr.trim() || null,
    });
  });

  child.on("error", err => {
    clearTimeout(timer);
    cleanup(tempDir);
    res.status(500).json({ verdict: "SYSTEM_ERROR", error: err.message });
  });
});

app.listen(PORT, () => console.log(`Runner listening on ${PORT}`));

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}