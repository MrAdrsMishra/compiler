import { spawnSync } from "child_process";
import fs from "fs";

const REPO = process.env.RUNNER_IMAGE_REPO || "mradrsmishra/compiler.com";
const VERSION_TAG = process.env.RUNNER_VERSION_TAG || "";
const NO_CACHE = process.env.RUNNER_NO_CACHE === "1";

const RUNNERS = [
  { key: "c", dir: "c-runner", tag: "c-runner" },
  { key: "cpp", dir: "cpp-runner", tag: "cpp-runner" },
  { key: "python", dir: "python-runner", tag: "python-runner" },
  { key: "go", dir: "go-runner", tag: "go-runner" },
  { key: "rust", dir: "rust-runner", tag: "rust-runner" },
  { key: "javascript", dir: "javascript-runner", tag: "javascript-runner" },
  { key: "typescript", dir: "typescript-runner", tag: "typescript-runner" },
  { key: "java", dir: "java-runner", tag: "java-runner" },
  { key: "csharp", dir: "csharp-runner", tag: "csharp-runner" },
  { key: "php", dir: "php-runner", tag: "php-runner" },
  { key: "ruby", dir: "ruby-runner", tag: "ruby-runner" },
  { key: "kotlin", dir: "kotlin-runner", tag: "kotlin-runner" },
  { key: "swift", dir: "swift-runner", tag: "swift-runner" },
  { key: "r", dir: "r-runner", tag: "r-runner" },
  { key: "bash", dir: "bash-runner", tag: "bash-runner" },
];

function runDocker(args, label) {
  const result = spawnSync("docker", args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${label} failed`);
  }
}

function imageName(tag) {
  return `${REPO}:${tag}`;
}

console.log("🚀 Build + tag + push started");
console.log(`📦 Repository: ${REPO}`);
if (VERSION_TAG) {
  console.log(`🏷️  Version tag: ${VERSION_TAG}`);
}

const failed = [];

for (const runner of RUNNERS) {
  const context = `./${runner.dir}`;
  const baseImage = imageName(runner.tag);

  if (!fs.existsSync(context)) {
    console.warn(`⚠️  Skipping ${runner.key}: Missing ${context}`);
    continue;
  }

  console.log(`\n🔧 [${runner.key}] Building ${baseImage}`);

  try {
    const buildArgs = ["build", "-t", baseImage];
    if (NO_CACHE) {
      buildArgs.push("--no-cache");
    }
    buildArgs.push(context);

    runDocker(buildArgs, `build ${runner.key}`);

    if (VERSION_TAG) {
      const versionedImage = imageName(`${runner.tag}-${VERSION_TAG}`);
      console.log(`🏷️  [${runner.key}] Tagging ${versionedImage}`);
      runDocker(["tag", baseImage, versionedImage], `tag ${runner.key}`);
      console.log(`📤 [${runner.key}] Pushing ${versionedImage}`);
      runDocker(["push", versionedImage], `push versioned ${runner.key}`);
    }

    console.log(`📤 [${runner.key}] Pushing ${baseImage}`);
    runDocker(["push", baseImage], `push ${runner.key}`);

    console.log(`✅ [${runner.key}] Done`);
  } catch (err) {
    console.error(`❌ [${runner.key}] ${err.message}`);
    failed.push(runner.key);
  }
}

if (failed.length > 0) {
  console.error(`\n❌ Failed runners: ${failed.join(", ")}`);
  process.exit(1);
}

console.log("\n✨ All runners built and pushed successfully");