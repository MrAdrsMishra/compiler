import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import useCustomizationStore from "./CustomizationStore";

export const CodeEditor = () => {
  const [rightPanelWidth, setRightPanelWidth] = useState(380);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(() => window.innerWidth < 1100);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const layoutRef = useRef<HTMLDivElement | null>(null);

  const {
    selectedLanguage,
    openLanguages,
    userCode,
    userInput,
    output,
    executionTime,
    memoryUsage,
    isRunning,
    setLanguage,
    closeLanguage,
    setCode,
    setUserInput,
    runCode,
    theme,
    setTheme,
    isFullscreen,
    toggleFullscreen,
  } = useCustomizationStore();

  // Monaco language mapping
  const languageMap: Record<string, string> = {
    c: "c",
    cpp: "cpp",
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    go: "go",
    golang: "go",
    rust: "rust",
    java: "java",
    csharp: "csharp",
    php: "php",
    ruby: "ruby",
    kotlin: "kotlin",
    swift: "swift",
    r: "r",
    bash: "shell",
  };
  const IdeThemeMap: Record<string, string> = {
    github: "vs-light",
    dracula: "vs-dark",
    monokai: "vs-dark",
    solarized: "vs-light",
    highcontrast: "hc-black",
  };

  const selectableLanguages = Object.keys(languageMap).filter((lang) => lang !== "golang");

  const monacoLanguage = languageMap[selectedLanguage] || "javascript";

  const fileNameMap: Record<string, string> = {
    c: "main.c",
    cpp: "main.cpp",
    python: "script.py",
    javascript: "index.js",
    typescript: "app.ts",
    go: "main.go",
    golang: "main.go",
    rust: "main.rs",
    java: "Main.java",
    csharp: "Program.cs",
    php: "index.php",
    ruby: "main.rb",
    kotlin: "Main.kt",
    swift: "main.swift",
    r: "script.r",
    bash: "script.sh",
  };

  useEffect(() => {
    const onResize = () => {
      setIsCompactLayout(window.innerWidth < 1100);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isCompactLayout || isFullscreen) {
      setIsDragging(false);
    }
  }, [isCompactLayout, isFullscreen]);

  // Theme-aware colors effect
  useEffect(() => {
    const themeColors: Record<
      string,
      { bg: string; text: string; border: string; panelBg: string; headerBg: string }
    > = {
      github: { bg: "#f6f8fa", text: "#24292e", border: "#e1e4e8", panelBg: "#ffffff", headerBg: "#f6f8fa" },
      dracula: { bg: "#282a36", text: "#f8f8f2", border: "#44475a", panelBg: "#282a36", headerBg: "#21222c" },
      monokai: { bg: "#272822", text: "#f8f8f2", border: "#49483e", panelBg: "#272822", headerBg: "#1e1f1c" },
      solarized: { bg: "#fdf6e3", text: "#657b83", border: "#eee8d5", panelBg: "#fdf6e3", headerBg: "#eee8d5" },
      highcontrast: { bg: "#000000", text: "#eeb657", border: "#ffffff", panelBg: "#000000", headerBg: "#1a1a1a" },
    };

    const colors = themeColors[theme] || themeColors.dracula;
    const root = document.documentElement;
    root.style.setProperty("--bg-color", colors.bg);
    root.style.setProperty("--text-color", colors.text);
    root.style.setProperty("--border-color", colors.border);
    root.style.setProperty("--panel-bg", colors.panelBg);
    root.style.setProperty("--header-bg", colors.headerBg);
  }, [theme]);

  // Ctrl + Enter shortcut
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
      if (e.key === "Escape" && isFullscreen) {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [runCode, isFullscreen, toggleFullscreen]);

  // Drag logic
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = layoutRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      const min = 320;
      const max = Math.max(min, Math.floor(rect.width * 0.55));

      setRightPanelWidth(Math.max(min, Math.min(max, newWidth)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "default";
    };

    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleCopyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  return (
    <div
      className={`${
        isFullscreen
          ? "fixed inset-0 z-50 p-0 rounded-none bg-stone-900 overflow-hidden"
          : "w-full rounded-[2.25rem] border border-white/80 bg-white/85 p-4 shadow-[0_25px_60px_rgba(234,88,12,0.12)] backdrop-blur-xl sm:p-6"
      }`}
    >
      <div
        ref={layoutRef}
        className={`flex gap-4 ${isFullscreen ? "h-full" : "min-h-165"} ${
          isCompactLayout ? "flex-col" : ""
        }`}
      >
        {/* Editor Panel */}
        <div
          className={`flex-1 flex flex-col border border-(--border-color) rounded-2xl overflow-hidden shadow-lg bg-(--panel-bg) transition-colors duration-200 ${
            isFullscreen ? "rounded-none" : ""
          }`}
        >
          {/* File Tabs Bar */}
          <div className="border-b border-(--border-color) bg-(--header-bg) px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {openLanguages.map((lang) => {
                const isActive = lang === selectedLanguage;
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`group relative flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-mono font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "border-orange-500/80 bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 shadow-xs"
                        : "border-transparent text-stone-600 hover:bg-stone-200/50 hover:text-stone-900"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-orange-500 opacity-80" />
                    <span>{fileNameMap[lang] || `main.${lang}`}</span>
                    <span
                      role="button"
                      aria-label={`Close ${fileNameMap[lang] || `main.${lang}`}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        closeLanguage(lang);
                      }}
                      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] opacity-50 hover:bg-red-500 hover:text-white hover:opacity-100 transition-all"
                    >
                      ✕
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Status */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-medium text-stone-500 px-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monaco Editor</span>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              width="100%"
              language={monacoLanguage}
              value={userCode}
              theme={IdeThemeMap[theme] || "vs-dark"}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                roundedSelection: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        {/* Resizer */}
        {!isCompactLayout && (
          <div
            onMouseDown={() => setIsDragging(true)}
            className="w-1.5 cursor-col-resize rounded-full bg-stone-200 transition-colors hover:bg-orange-500 active:bg-orange-600"
          />
        )}

        {/* Right Panel: Controls, Input & Output */}
        <div
          style={{ width: isCompactLayout ? undefined : rightPanelWidth }}
          className={`flex flex-col gap-4 overflow-hidden ${
            isCompactLayout ? "w-full flex-1" : ""
          }`}
        >
          {/* Controls Toolbar */}
          <div className="flex flex-col border border-(--border-color) rounded-2xl overflow-hidden shadow-lg bg-(--panel-bg) transition-colors duration-200">
            <div className="flex flex-wrap gap-2.5 p-3.5 border-b border-(--border-color) bg-(--header-bg) items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-600">
                  Settings
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Language Select */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/80 border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-mono font-medium outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  aria-label="Select programming language"
                >
                  {selectableLanguages.map((lang) => (
                    <option key={lang} value={lang} className="text-stone-900">
                      {lang.toUpperCase()} ({fileNameMap[lang] || lang})
                    </option>
                  ))}
                </select>

                {/* Theme Select */}
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-white/80 border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-mono font-medium outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  aria-label="Select editor theme"
                >
                  {Object.keys(IdeThemeMap).map((t) => (
                    <option key={t} value={t} className="text-stone-900">
                      {t.toUpperCase()}
                    </option>
                  ))}
                </select>

                {/* Fullscreen button */}
                <button
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
                  className="p-2 rounded-xl border border-stone-200 bg-white/80 text-stone-700 hover:bg-stone-100 transition active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </button>

                {/* Run Button */}
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`group inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-mono font-bold text-white shadow-md transition-all duration-300 ${
                    isRunning
                      ? "bg-stone-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/25 active:scale-95"
                  }`}
                >
                  {isRunning ? (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Code</span>
                      <span className="text-[10px] font-sans font-normal opacity-80">(Ctrl+Enter)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="px-4 py-2 border-b border-(--border-color) text-xs font-mono font-semibold text-stone-500 bg-(--header-bg) flex justify-between items-center">
              <span>Stdin (Program Input)</span>
              <span className="text-[10px] text-stone-400">Optional</span>
            </div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter standard input values here..."
              className="w-full h-28 p-3.5 bg-transparent text-xs font-mono outline-none resize-none placeholder:text-stone-400"
            />
          </div>

          {/* Metrics bar */}
          <div className="flex items-center justify-between rounded-xl border border-(--border-color) bg-(--panel-bg) px-4 py-2.5 text-xs font-mono">
            <span className="font-semibold text-stone-500">Execution Metrics</span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1 text-stone-600">
                <span>⏱</span>
                <span>{executionTime || "-- ms"}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-stone-600">
                <span>💾</span>
                <span>{memoryUsage || "-- KB"}</span>
              </span>
              {isRunning && (
                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              )}
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex-1 flex flex-col border border-(--border-color) rounded-2xl overflow-hidden shadow-lg bg-(--header-bg) text-(--text-color)">
            <div className="px-4 py-2.5 border-b border-(--border-color) bg-(--header-bg) font-mono font-semibold text-xs flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span>Stdout Output</span>
                {output && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </span>
              {output ? (
                <button
                  onClick={handleCopyOutput}
                  className="inline-flex items-center gap-1 rounded-lg bg-stone-200/70 px-2.5 py-1 text-[11px] font-mono text-stone-700 hover:bg-stone-300 transition"
                >
                  {copiedOutput ? "✓ Copied!" : "📋 Copy"}
                </button>
              ) : null}
            </div>
            <div className="flex-1 p-4 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed selection:bg-orange-200/70">
              {output ? (
                output
              ) : (
                <span className="opacity-40 italic">
                  Press 'Run Code' or Ctrl+Enter to execute program and view compiler output...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};