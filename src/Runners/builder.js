import { spawnSync } from 'child_process';
import fs from 'fs';

const IMAGES = {
  cpp: "mradrsmishra/compiler.com:cpp-runner",
  python: "mradrsmishra/compiler.com:python-runner",
  rust: "mradrsmishra/compiler.com:rust-runner",
  javascript: "mradrsmishra/compiler.com:javascript-runner",
  java: "mradrsmishra/compiler.com:java-runner",
};

console.log("🚀 Starting Batch Runner Build...");

Object.entries(IMAGES).forEach(([lang, image]) => {
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
