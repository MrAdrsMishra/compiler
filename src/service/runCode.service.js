// import fs from "fs";
// import path from "path";
// import { exec } from "child_process";
// import os from "os";
// import { stderr, stdout } from "process";

// export const runCode = async (req, res) => {
//  console.log('yes u are')
//   try {
//     const { selectedLanguage, userCode, userInput } = req.body;
//     const tmpBase = os.tmpdir();
//     const tempDir = fs.mkdtempSync(path.join(tmpBase, "code-run-"));
//     const images = {
//       cpp: "mradrsmishra/compiler.com:cpp-runner",
//       python: "mradrsmishra/compiler.com:python-runner",
//       go: "mradrsmishra/compiler.com:go-runner",
//       rust: "mradrsmishra/compiler.com:rust-runner",
//       javascript: "mradrsmishra/compiler.com:javascript-runner",
//       java: "mradrsmishra/compiler.com:java-runner",
//     };
//     const imagesExtension = {
//       cpp: "cpp",
//       python: "py",
//       go: "go",
//       java: "java",
//       javascript: "js",
//       rust: "rs",
//     };

//     // Use language-appropriate filenames expected by the runner's run.sh
//     const codeFilename =
//       `code.${imagesExtension[selectedLanguage]}` || "code.txt";
//     const inputFilename = "input.txt";
//     const codePath = path.join(tempDir, codeFilename);
//     const inputPath = path.join(tempDir, inputFilename);
//     fs.writeFileSync(codePath, userCode || "");
//     fs.writeFileSync(inputPath, userInput || "");

//     // Verify files were created
//     const filesInTemp = fs.readdirSync(tempDir);

//     const image = images[selectedLanguage];

//     const command = `docker run --rm -v "${tempDir}:/app/work" ${image}`;
//     exec(
//       command,
//       { maxBuffer: 1024 * 1024 * 10 }, // 10MB buffer
//       (error, stdout, stderr) => {
//         // Always attempt to return both stdout and stderr for debugging
//         const out = stdout || null;
//         const err = stderr || (error ? error.message : null);
//         console.log({
//           codeFilename: codeFilename,
//           inputFilename: inputFilename,
//         });
//         try {
//           fs.rmSync(tempDir, { recursive: true, force: true });
//         } catch (cleanupErr) {
//           console.error("Failed to remove temp dir:", cleanupErr);
//         }
//         console.log({ stdout: out, stderr: err, commandErr: error });
//         return res.json({ command, output: out, error: err });
//       }
//     );
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: err.message });
//   }
// };
import axios from "axios";

export const runCode = async (req, res) => {
  const { selectedLanguage, userCode, userInput } = req.body;

  try {
    const runnerRequestTimeout = parseInt(process.env.RUNNER_REQUEST_TIMEOUT_MS, 10) || 20000;
    const response = await axios.post(
      `${process.env.RUNNER_URL}/run`,
      { selectedLanguage, userCode, userInput },
      { timeout: runnerRequestTimeout }
    );
    console.log(response.data)
    res.json(response.data);
  } catch (err) {
    const isTimeout = err.code === "ECONNABORTED";
    res.status(500).json({
      verdict: isTimeout ? "RUNNER_TIMEOUT" : "RUNNER_ERROR",
      error: err.message,
    });
  }
};
