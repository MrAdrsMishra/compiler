import { spawnSync } from 'child_process';
import fs from 'fs';

const IMAGE_REPO = process.env.RUNNER_IMAGE_REPO || "mradrsmishra/compiler.com";
const BUILD_LEGACY_RUNNERS = process.env.BUILD_LEGACY_RUNNERS === "1";
const BUILD_LANGS = process.env.BUILD_LANGS || "";

const SHARED_IMAGES = {
  gcc: `${IMAGE_REPO}:gcc-runner`,
  node: `${IMAGE_REPO}:node-runner`,
};

const CORE_IMAGES = {
  python: `${IMAGE_REPO}:python-runner`,
  go: `${IMAGE_REPO}:go-runner`,
  rust: `${IMAGE_REPO}:rust-runner`,
  java: `${IMAGE_REPO}:java-runner`,
  csharp: `${IMAGE_REPO}:csharp-runner`,
  php: `${IMAGE_REPO}:php-runner`,
  ruby: `${IMAGE_REPO}:ruby-runner`,
  kotlin: `${IMAGE_REPO}:kotlin-runner`,
  swift: `${IMAGE_REPO}:swift-runner`,
  r: `${IMAGE_REPO}:r-runner`,
  bash: `${IMAGE_REPO}:bash-runner`,
};

const LEGACY_IMAGES = {
  c: `${IMAGE_REPO}:c-runner`,
  cpp: `${IMAGE_REPO}:cpp-runner`,
  javascript: `${IMAGE_REPO}:javascript-runner`,
  typescript: `${IMAGE_REPO}:typescript-runner`,
};

const IMAGES = {
  ...SHARED_IMAGES,
  ...CORE_IMAGES,
  ...(BUILD_LEGACY_RUNNERS ? LEGACY_IMAGES : {}),
};

const requestedLangs = new Set(
  BUILD_LANGS
    .split(",")
    .map((lang) => lang.trim().toLowerCase())
    .filter(Boolean)
);

const selectedImages = Object.entries(IMAGES).filter(([lang]) => {
  if (requestedLangs.size === 0) return true;
  return requestedLangs.has(lang);
});

console.log("🚀 Starting Batch Runner Build...");
if (BUILD_LEGACY_RUNNERS) {
  console.log("🧩 Legacy split runners: enabled");
}
if (requestedLangs.size > 0) {
  console.log(`🎯 Language filter: ${Array.from(requestedLangs).join(", ")}`);
}

selectedImages.forEach(([lang, image]) => {
    const context = `./${lang}-runner`;
    
    if (!fs.existsSync(context)) {
        console.warn(`⚠️  Skipping ${lang}: Directory ${context} not found.`);
        return;
    }

    console.log(`\n📦 Building ${lang.toUpperCase()} runner [${image}]...`);
    const res = spawnSync("docker", ["build", "-t", image, context], { stdio: "inherit" });
    
    if (res.status !== 0) {
        console.error(`❌ Failed to build ${image}`);
    } else {
        console.log(`✅ Successfully built ${image}`);
    }
});

console.log("\n✨ All builds completed!");
