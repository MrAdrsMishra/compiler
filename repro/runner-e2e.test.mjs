import axios from "axios";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { LANGUAGE_CASES, MALICIOUS_CASES, RUNNER_URL, RUNNER_PORT, testRateLimit, __dirname } from "./runner-e2e-cases.mjs";

async function main() {
  // Start runner service
  const runnerProc = spawn("node", ["src/Runners/src/runner.js"], {
    cwd: path.join(__dirname, ".."),
    env: { ...process.env, RUNNER_PORT: String(RUNNER_PORT), RUNNER_USE_SHARED_IMAGES: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  runnerProc.stdout.on("data", (d) => process.stdout.write(`[runner] ${d}`));
  runnerProc.stderr.on("data", (d) => process.stdout.write(`[runner-err] ${d}`));

  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try {
      const r = await axios.get(`${RUNNER_URL}/runner-health`, { timeout: 2000 });
      if (r.status === 200) up = true;
    } catch {}
    if (!up) await new Promise((res) => setTimeout(res, 1500));
  }
  if (!up) {
    console.error("❌ Runner failed to start");
    runnerProc.kill();
    process.exit(1);
  }
  console.log("✅ Runner service is up");

  let pass = 0;
  let fail = 0;

  console.log("\n--- Malicious code rejection (must be SECURITY_VIOLATION) ---");
  for (const m of MALICIOUS_CASES) {
    try {
      const r = await axios.post(
        `${RUNNER_URL}/run`,
        { selectedLanguage: m.selectedLanguage, userCode: m.code, userInput: "" },
        { validateStatus: () => true, timeout: 30000 }
      );
      const isBlocked = r.status === 403 && r.data.verdict === "SECURITY_VIOLATION";
      if (isBlocked) {
        pass++;
        console.log(`   ✅ [${m.label}] blocked -> ${r.data.verdict}`);
      } else {
        fail++;
        console.error(`   ❌ [${m.label}] expected 403/SECURITY_VIOLATION, got ${r.status} ${JSON.stringify(r.data)}`);
      }
    } catch (e) {
      fail++;
      console.error(`   ❌ [${m.label}] error: ${e.message}`);
    }
  }

  console.log("\n--- Language execution (must output expected value) ---");
  for (const c of LANGUAGE_CASES) {
    const startedAt = Date.now();
    try {
      const r = await axios.post(
        `${RUNNER_URL}/run`,
        { selectedLanguage: c.selectedLanguage, userCode: c.code, userInput: c.stdin },
        { validateStatus: () => true, timeout: 120000 }
      );
      const data = r.data;
      const output = (data.output || "") + "\n" + (data.error || "");
      const ok = data.verdict === "AC" && c.expectedIncludes.every((s) => output.includes(s));
      const ms = Date.now() - startedAt;
      if (ok) {
        pass++;
        console.log(`   ✅ ${c.selectedLanguage}: verdict=${data.verdict} output="${(data.output || "").trim()}" (${(ms / 1000).toFixed(1)}s)`);
      } else {
        fail++;
        console.error(`   ❌ ${c.selectedLanguage}: verdict=${data.verdict} output=${JSON.stringify(data.output)} error=${JSON.stringify(data.error)}`);
      }
    } catch (e) {
      fail++;
      console.error(`   ❌ ${c.selectedLanguage}: exception ${e.message}`);
    }
  }

  console.log("\n--- Rate limiting ---");
  const rateOk = await testRateLimit();
  if (rateOk) pass++;
  else fail++;

  runnerProc.kill();
  console.log(`\n==============================`);
  console.log(`RUNNER E2E TESTS: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});