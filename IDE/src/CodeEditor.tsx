import { useEffect } from "react";
import editorStore from "./customizationStore";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-chrome";
export const CodeEditor = () => {
  const {
    selectedLanguage,
    userCode,
    userInput,
    output,
    isRunning,
    setLanguage,
    setCode,
    setUserInput,
    runCode,
  } = editorStore();

  const modeMap: Record<string, string> = {
    cpp: "c_cpp",
    python: "python",
    javascript: "javascript",
  };

  const aceMode = modeMap[selectedLanguage];

  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        runCode();
      }
    };

    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [runCode]);

  return (
    <div className="w-full h-screen flex flex-col">

      {/* Toolbar */}

      <div className="flex gap-3 p-3 border-b">

        <select
          value={selectedLanguage}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button
          onClick={runCode}
          disabled={isRunning}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          {isRunning ? "Running..." : "Run Code"}
        </button>

      </div>

      {/* Editor + Right Panel */}

      <div className="flex flex-1">

        <div className="w-2/3">

          <AceEditor
            mode={aceMode}
            theme="monokai"
            value={userCode}
            onChange={setCode}
            width="100%"
            height="100%"
            fontSize={14}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
            }}
          />

        </div>

        {/* Input + Output */}

        <div className="w-1/3 flex flex-col border-l">

          <div className="p-2 border-b font-semibold">
            Custom Input
          </div>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="p-2 h-40 border-b resize-none"
            placeholder="Enter input..."
          />

          <div className="p-2 border-b font-semibold">
            Output
          </div>

          <pre className="flex-1 bg-black text-green-400 p-3 overflow-auto text-sm">
            {output}
          </pre>

        </div>

      </div>
    </div>
  );
};

