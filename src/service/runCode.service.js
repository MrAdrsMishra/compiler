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
    // console.log("runner servicecalled")

    const runnerData = response.data;
    res.json({
      data: {
        stdout: runnerData.output,
        stderr: runnerData.error,
        compile_output: runnerData.verdict === "COMPILE_ERROR" ? runnerData.error : null,
        time: runnerData.time ?? null,
        memory: runnerData.memory ?? null,
      }
    });
  } catch (err) {
    console.log("runner servicecalling failed")
    const isTimeout = err.code === "ECONNABORTED";
    res.status(500).json({
      verdict: isTimeout ? "RUNNER_TIMEOUT" : "RUNNER_ERROR",
      message: isTimeout ? "Execution Timeout" : "Execution failed",
      error: err.message,
    });
  }
};
