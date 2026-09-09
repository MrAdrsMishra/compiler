import express from "express";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn, spawnSync } from "child_process";
import axios from "axios";

const app = express();
app.use(express.json());

const PORT = process.env.RUNNER_PORT || 4000;

/* ------------------ CONFIG ------------------ */ 
const IMAGE_REPO = process.env.RUNNER_IMAGE_REPO || "mradrsmishra/compiler.com";
const USE_SHARED_IMAGES = process.env.RUNNER_USE_SHARED_IMAGES !== "0";
const RUNNER_ALLOWED_LANGS = process.env.RUNNER_ALLOWED_LANGS || "";

const imageTag = (tag) => `${IMAGE_REPO}:${tag}`;

const LEGACY_IMAGE_MAP = {
  c: imageTag("c-runner"),
  cpp: imageTag("cpp-runner"),
  python: imageTag("python-runner"),
  go: imageTag("go-runner"),
  golang: imageTag("go-runner"),
  rust: imageTag("rust-runner"),
  javascript: imageTag("javascript-runner"),
  typescript: imageTag("typescript-runner"),
  java: imageTag("java-runner"),
  csharp: imageTag("csharp-runner"),
  php: imageTag("php-runner"),
  ruby: imageTag("ruby-runner"),
  kotlin: imageTag("kotlin-runner"),
  swift: imageTag("swift-runner"),
  r: imageTag("r-runner"),
  bash: imageTag("bash-runner"),
};

const SHARED_IMAGE_MAP = {
  c: imageTag("gcc-runner"),
  cpp: imageTag("gcc-runner"),
  python: imageTag("python-runner"),
  go: imageTag("go-runner"),
  golang: imageTag("go-runner"),
  rust: imageTag("rust-runner"),
  javascript: imageTag("node-runner"),
  typescript: imageTag("node-runner"),
  java: imageTag("java-runner"),
  csharp: imageTag("csharp-runner"),
  php: imageTag("php-runner"),
  ruby: imageTag("ruby-runner"),
  kotlin: imageTag("kotlin-runner"),
  swift: imageTag("swift-runner"),
  r: imageTag("r-runner"),
  bash: imageTag("bash-runner"),
};

const IMAGES = USE_SHARED_IMAGES ? SHARED_IMAGE_MAP : LEGACY_IMAGE_MAP;

const ALLOWED_LANGS = new Set(
  RUNNER_ALLOWED_LANGS
    .split(",")
    .map((lang) => lang.trim().toLowerCase())
    .filter(Boolean)
);

const localImageCache = new Set();
const imagePullInFlight = new Map();

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

const TIME_LIMIT_MS = 10000;
const OUTPUT_LIMIT = 100_000;

const RESOURCE_LIMITS = {
  default: { memory: "128m", cpus: "0.5" },
  c: { memory: "192m", cpus: "0.75" },
  cpp: { memory: "256m", cpus: "1.0" },
  go: { memory: "512m", cpus: "1.0" },
  java: { memory: "512m", cpus: "1.0" },
  kotlin: { memory: "1024m", cpus: "1.5" },
  swift: { memory: "1024m", cpus: "1.5" },
  csharp: { memory: "512m", cpus: "1.0" },
  rust: { memory: "512m", cpus: "1.0" },
};

const TIME_LIMITS_MS = {
  default: TIME_LIMIT_MS,
  go: 20000,
  java: 20000,
  kotlin: 45000,
  swift: 45000,
  csharp: 25000,
  rust: 25000,
};

async function ensureImageAvailable(image) {
  if (localImageCache.has(image)) {
    return;
  }

  if (imagePullInFlight.has(image)) {
    await imagePullInFlight.get(image);
    return;
  }

  const pullPromise = new Promise((resolve, reject) => {
    try {
      const inspectRes = spawnSync("docker", ["image", "inspect", image], { stdio: "ignore" });
      if (inspectRes.status !== 0) {
        console.log(`Image ${image} not found locally, pulling...`);
        const pullRes = spawnSync("docker", ["pull", image], { stdio: "inherit" });
        if (pullRes.status !== 0) {
          reject(new Error(`Failed to pull image ${image}`));
          return;
        }
      }

      localImageCache.add(image);
      resolve();
    } catch (err) {
      reject(err);
    }
  });

  imagePullInFlight.set(image, pullPromise);

  try {
    await pullPromise;
  } finally {
    imagePullInFlight.delete(image);
  }
}

/* ------------------ RUN CODE ------------------ */
app.post("/run", async (req, res) => {
  const { selectedLanguage: requestedLanguage, userCode = "", userInput = "" } = req.body;
  const selectedLanguage = String(requestedLanguage || "").trim().toLowerCase();
  const startTime = process.hrtime.bigint();

  if (!IMAGES[selectedLanguage]) {
    return res.status(400).json({
      success: false,
      verdict: "INVALID_LANGUAGE",
      error: "Unsupported language",
    });
  }

  if (ALLOWED_LANGS.size > 0 && !ALLOWED_LANGS.has(selectedLanguage)) {
    return res.status(403).json({
      success: false,
      verdict: "LANGUAGE_BLOCKED",
      error: `Language ${selectedLanguage} is disabled on this runner`,
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

  // Pull only when a language is first used and cache the result.
  const image = IMAGES[selectedLanguage];
  try {
    await ensureImageAvailable(image);
  } catch (err) {
    cleanup(tempDir);
    return res.status(500).json({ verdict: "SYSTEM_ERROR", error: err.message });
  }

  const containerName = `judge-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const limits = RESOURCE_LIMITS[selectedLanguage] || RESOURCE_LIMITS.default;
  const timeLimitForRun = TIME_LIMITS_MS[selectedLanguage] || TIME_LIMITS_MS.default;

  const dockerArgs = [
    "run",
    "--rm",
    "--name",
    containerName,
    "--network=none",
    `--memory=${limits.memory}`,
    `--cpus=${limits.cpus}`,
    "--pids-limit=128",
    "--read-only",
    "--cap-drop=ALL",
    "--security-opt=no-new-privileges",
    "--tmpfs=/tmp:rw,nosuid,exec,size=64m",
    "-e",
    `SELECTED_LANGUAGE=${selectedLanguage}`,
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
  let peakMemoryBytes = 0;

  const parseMemorySample = (sample) => {
    if (!sample) return null;
    const trimmed = sample.trim();
    if (!trimmed) return null;
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const sampleMemory = () => {
    // cgroup v2 path first
    const memCurrent = spawnSync("docker", ["exec", containerName, "cat", "/sys/fs/cgroup/memory.current"], {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
      timeout: 250,
    });

    if (memCurrent.status === 0) {
      const parsed = parseMemorySample(memCurrent.stdout);
      if (parsed && parsed > peakMemoryBytes) peakMemoryBytes = parsed;
      return;
    }

    // cgroup v1 fallback
    const memLegacy = spawnSync("docker", ["exec", containerName, "cat", "/sys/fs/cgroup/memory/memory.usage_in_bytes"], {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
      timeout: 250,
    });

    if (memLegacy.status === 0) {
      const parsed = parseMemorySample(memLegacy.stdout);
      if (parsed && parsed > peakMemoryBytes) peakMemoryBytes = parsed;
    }
  };

  sampleMemory();
  const memorySampler = setInterval(sampleMemory, 75);

  const timer = setTimeout(() => {
    // Mark as timed out and attempt to kill the container (safer than killing the docker client process)
    verdict = "TLE";
    killed = true;
    const killer = spawn("docker", ["kill", containerName]);
    killer.on("error", () => {});
    killer.on("close", () => {});
  }, timeLimitForRun);

  child.stdout.on("data", d => {
    stdout += d.toString().slice(0, OUTPUT_LIMIT - stdout.length);
  });

  child.stderr.on("data", d => {
    stderr += d.toString().slice(0, OUTPUT_LIMIT - stderr.length);
  });

  child.on("close", (code, signal) => {
    console.log(`Container ${containerName} exited with code=${code} signal=${signal}`);
    clearTimeout(timer);
    clearInterval(memorySampler);
    sampleMemory();
    cleanup(tempDir);

    const elapsedMs = Number((process.hrtime.bigint() - startTime) / 1000000n);
    const elapsedSec = (elapsedMs / 1000).toFixed(2);
    const peakMemoryKb = peakMemoryBytes > 0 ? Math.round(peakMemoryBytes / (1024*1024)) : null;

    // Timeout takes precedence
    if (killed) {
      verdict = "TLE";
      if (!stderr.trim()) {
        stderr = `Time limit exceeded (${timeLimitForRun} ms)`;
      }
    }
    else if (code === 137 && !stderr.trim()) {
      verdict = "RUNTIME_ERROR";
      stderr = "Process terminated by runtime limits (possible memory limit exceeded).";
    }
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
      time: `${elapsedSec}s`,
      memory: peakMemoryKb,
    });
  });

  child.on("error", err => {
    clearTimeout(timer);
    clearInterval(memorySampler);
    cleanup(tempDir);
    res.status(500).json({ verdict: "SYSTEM_ERROR", error: err.message });
  });
});
app.get('/runner-health',(_,res)=> {
  res.send('runner running fine and successfully up')
})
app.listen(PORT||3000, () => console.log(`Runner listening on ${PORT}`));

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

