import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import useCustomizationStore from "./CustomizationStore";

export const CodeEditor = () => {
  const [rightPanelWidth, setRightPanelWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(
    () => window.innerWidth < 1100,
  );
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<"console" | "io" | "ai">(
    "console",
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const newTabBtnRef = useRef<HTMLButtonElement | null>(null);

  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isNewTabMenuOpen, setIsNewTabMenuOpen] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const handleToggleNewTabMenu = () => {
    if (!isNewTabMenuOpen && newTabBtnRef.current) {
      const rect = newTabBtnRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + 6,
        left: rect.left,
      });
    }
    setIsNewTabMenuOpen(!isNewTabMenuOpen);
  };
  // async function chatWithAi() {
  //   setIsAiThinking(true);
  //   console.log("clicked");

  //   const result = await fetch("http://localhost:5000/chat", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       prompt: aiPrompt,
  //     }),
  //   });
  //   const res = await result.json();
  //   setAiResponse(res.text);
  //   setIsAiThinking(false);
  // }

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
    // Settings state & actions
    fontSize,
    setFontSize,
    wordWrap,
    setWordWrap,
    disableAutocomplete,
    setDisableAutocomplete,
    editorType,
    setEditorType,
    isSettingsOpen,
    openSettings,
    closeSettings,
    resetSettings,
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

  const selectableLanguages = Object.keys(languageMap).filter(
    (lang) => lang !== "golang",
  );

  const monacoLanguage = languageMap[selectedLanguage] || "javascript";

  const fileNameMap: Record<string, string> = {
    c: "main.c",
    cpp: "Main.cpp",
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

  // Resize listener
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

  // Dynamic Theme Colors
  const isDarkMode =
    theme === "dracula" || theme === "monokai" || theme === "highcontrast";

  // Keyboard Shortcuts (Ctrl+Enter to run, Esc to exit settings/fullscreen)
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        runCode();
        setActiveRightTab("console");
      }
      if (e.key === "Escape") {
        if (isSettingsOpen) {
          closeSettings();
        } else if (isFullscreen) {
          toggleFullscreen();
        }
      }
    };

    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [runCode, isFullscreen, toggleFullscreen, isSettingsOpen, closeSettings]);

  // Resizer Mouse Drag logic
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = layoutRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      const min = 300;
      const max = Math.max(min, Math.floor(rect.width * 0.65));

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

  const handleAiAsk = (customQuery?: string) => {
    const query = customQuery || aiPrompt;
    if (!query.trim()) return;

    setIsAiThinking(true);
    setAiResponse(null);

    // Mock AI response for rapid assistant view
    setTimeout(() => {
      setIsAiThinking(false);
      if (query.toLowerCase().includes("explain")) {
        setAiResponse(
          `### Code Breakdown:\nThis **${selectedLanguage.toUpperCase()}** script initializes standard I/O operations and prints outputs. You can modify variables or add input parameters in the **I/O** tab.`,
        );
      } else if (
        query.toLowerCase().includes("bug") ||
        query.toLowerCase().includes("fix")
      ) {
        setAiResponse(
          `### Bug Check:\n- Syntax looks valid for **${selectedLanguage.toUpperCase()}**.\n- Ensure memory and recursion limits fit within runtime parameters.`,
        );
      } else {
        setAiResponse(
          `### AI Code Assistant:\nHere is advice for **${selectedLanguage.toUpperCase()}**:\n- Use standard input handling when reading variables.\n- Execution result will stream into the **Console** tab when compiled.`,
        );
      }
    }, 800);
  };
  const handleSearch = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      const action =
        editorRef.current.getAction("editor.action.startFindReplaceAction") ||
        editorRef.current.getAction("actions.find");
      if (action) {
        action.run();
      } else {
        editorRef.current.trigger("search", "actions.find", null);
      }
    }
  };
  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode
          ? "bg-[#121316] text-stone-100"
          : "bg-stone-50 text-stone-900"
      } font-sans select-none overflow-hidden`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR HEADER                                                      */}
      {/* ========================================================================= */}
      <header
        className={`h-14 px-4 border-b flex items-center justify-between gap-3 ${
          isDarkMode
            ? "bg-[#18191c] border-stone-800"
            : "bg-white border-stone-200"
        } shadow-xs z-30 shrink-0`}
      >
        {/* Left Section: Logo & Upgrade */}
        <div className="flex items-center gap-3">
          <div 
          // naviaget top home page
          onClick={ () =>{
            window.location.href = "/";
          }}
          className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md">
              ⚡
            </div>
            <span className="font-bold text-base tracking-tight hidden sm:inline">
              RunMe
            </span>
          </div>
        </div>

        {/* Center Section: AI Button, Language Selector, Run Button, Options Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Pill */}
          <button
            onClick={() => setActiveRightTab("ai")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 text-xs font-mono font-bold transition active:scale-95"
          >
            <span>✨</span>
            <span>AI</span>
          </button>

          {/* Language Selector Dropdown Pill */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Programming Language"
              className={`appearance-none bg-blue-600/10 text-blue-500 border border-blue-500/30 hover:border-blue-500/60 font-mono font-bold text-xs px-3.5 py-1.5 pr-7 rounded-full outline-none cursor-pointer transition`}
            >
              {selectableLanguages.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  className={
                    isDarkMode
                      ? "bg-stone-900 text-stone-100"
                      : "bg-white text-stone-900"
                  }
                >
                  {lang.toUpperCase()} ({fileNameMap[lang] || lang})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Pink/Rose RUN Button */}
          <button
            onClick={() => {
              runCode();
              setActiveRightTab("console");
            }}
            disabled={isRunning}
            className={`group flex items-center gap-2 px-5 py-1.5 rounded-full font-mono font-bold text-xs text-white shadow-md shadow-pink-500/25 transition-all duration-200 active:scale-95 cursor-pointer ${
              isRunning
                ? "bg-stone-500 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:from-pink-500 hover:to-rose-400 hover:shadow-pink-500/40"
            }`}
          >
            {isRunning ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <span>Run</span>
                <span className="text-xs">▶</span>
              </>
            )}
          </button>

          {/* Options Dropdown (⋮) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1.5 rounded-lg border ${
                isDarkMode
                  ? "border-stone-800 hover:bg-stone-800 text-stone-300"
                  : "border-stone-200 hover:bg-stone-100 text-stone-700"
              } transition`}
              title="More options"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {isMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border py-1 z-50 text-xs font-mono ${
                  isDarkMode
                    ? "bg-[#1c1d22] border-stone-800 text-stone-200"
                    : "bg-white border-stone-200 text-stone-800"
                }`}
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openSettings();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-orange-500/10 hover:text-orange-500 flex items-center justify-between"
                >
                  <span>Editor Settings</span>
                  <span>⚙️</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    toggleFullscreen();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-orange-500/10 hover:text-orange-500 flex items-center justify-between"
                >
                  <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                  <span>⛶</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setUserInput("");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-orange-500/10 hover:text-orange-500 flex items-center justify-between"
                >
                  <span>Clear Input</span>
                  <span>🧹</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Theme Toggle, Save, Share, Login */}
        <div className="hidden md:flex items-center gap-2">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setTheme(isDarkMode ? "github" : "dracula")}
            title="Toggle Light/Dark Theme"
            className={`p-2 rounded-xl border ${
              isDarkMode
                ? "border-stone-800 bg-stone-900 text-amber-400 hover:bg-stone-800"
                : "border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200"
            } transition`}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {/* Save Button */}
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold ${
              isDarkMode
                ? "border-stone-800 bg-stone-900/80 text-stone-300 hover:bg-stone-800"
                : "border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200"
            } transition`}
          >
            <span>💾</span>
            <span>Save</span>
          </button>

          {/* Share Button */}
          <button
            title="Share Workspace"
            className={`p-2 rounded-xl border ${
              isDarkMode
                ? "border-stone-800 bg-stone-900/80 text-stone-300 hover:bg-stone-800"
                : "border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200"
            } transition`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>

          {/* Login Button */}
          <button
            className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition ${
              isDarkMode
                ? "bg-white text-stone-900 hover:bg-stone-200"
                : "bg-stone-900 text-white hover:bg-stone-800"
            }`}
          >
            Login
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE CONTAINER (Sidebar + Editor + Console)                   */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative" ref={layoutRef}>
        {/* Leftmost Vertical Icon Sidebar */}
        <aside
          className={`w-12 shrink-0 border-r flex flex-col justify-between items-center py-3 ${
            isDarkMode
              ? "bg-[#151619] border-stone-800/80"
              : "bg-stone-100/70 border-stone-200"
          }`}
        >
          {/* Top Icons */}
          <div className="flex flex-col items-center gap-4">
            {/* Explorer icon */}
            <button
              className={`p-2 rounded-xl text-orange-500 bg-orange-500/10 border border-orange-500/20`}
              title="Files Explorer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </button>

            {/* Search icon */}
            <button
              className={`p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 transition`}
              onClick={handleSearch}
              title="Search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Bottom Icons */}
          <div className="flex flex-col items-center gap-4">
            {/* Execution History */}
            <button
              className={`p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 transition`}
              title="Execution History"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {/* Settings Gear (Triggers Settings Modal) */}
            <button
              onClick={openSettings}
              className={`p-2 rounded-xl text-stone-400 hover:text-orange-500 hover:bg-stone-800/50 transition cursor-pointer`}
              title="Editor Settings"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </aside>

        {/* Central Workspace (Editor + Console Split) */}
        <div
          className={`flex-1 flex ${isCompactLayout ? "flex-col" : "flex-row"} overflow-hidden`}
        >
          {/* Left Panel: Monaco Code Editor */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* File Tabs Bar */}
            <div
              className={`h-10 px-2 border-b flex items-center justify-between ${
                isDarkMode
                  ? "bg-[#18191c] border-stone-800"
                  : "bg-stone-100 border-stone-200"
              }`}
            >
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {openLanguages.map((lang) => {
                  const isActive = lang === selectedLanguage;
                  return (
                    <div
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg font-mono text-xs font-medium cursor-pointer border-t border-x transition ${
                        isActive
                          ? isDarkMode
                            ? "bg-[#1e1f23] text-orange-400 border-stone-800 border-t-orange-500"
                            : "bg-white text-orange-600 border-stone-200 border-t-orange-500 shadow-xs"
                          : isDarkMode
                            ? "bg-transparent text-stone-400 border-transparent hover:text-stone-200"
                            : "bg-transparent text-stone-600 border-transparent hover:text-stone-900"
                      }`}
                    >
                      <span className="text-[10px]">⚙️</span>
                      <span>{fileNameMap[lang] || `main.${lang}`}</span>
                      <span
                        role="button"
                        aria-label={`Close ${fileNameMap[lang] || `main.${lang}`}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          closeLanguage(lang);
                        }}
                        className="ml-1 opacity-40 hover:opacity-100 hover:text-red-500 transition"
                      >
                        ✕
                      </span>
                    </div>
                  );
                })}

                {/* New Tab (+) Button */}
                <div>
                  <button
                    ref={newTabBtnRef}
                    onClick={handleToggleNewTabMenu}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                      isNewTabMenuOpen
                        ? "bg-orange-500 text-white border-orange-500 scale-105 shadow-md shadow-orange-500/25"
                        : isDarkMode
                          ? "text-stone-400 border-stone-800 hover:text-stone-200 hover:bg-stone-800/60"
                          : "text-stone-600 border-stone-200 hover:text-stone-900 hover:bg-stone-200/60"
                    }`}
                    title="Open new file / language"
                    aria-label="Open new tab"
                  >
                    +
                  </button>

                  {isNewTabMenuOpen && (
                    <>
                      {/* Invisible Backdrop for click-outside close */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsNewTabMenuOpen(false)}
                      />

                      {/* Unclipped Fixed Expanding Popover Menu */}
                      <div
                        style={{ top: popoverPos.top, left: popoverPos.left }}
                        className={`fixed w-56 max-h-72 overflow-y-auto rounded-xl shadow-2xl border py-1.5 z-50 text-xs font-mono origin-top-left transition-all duration-200 ease-out transform animate-in fade-in slide-in-from-top-2 zoom-in-95 divide-y ${
                          isDarkMode
                            ? "bg-[#1c1d22] border-stone-800 text-stone-200 shadow-black/80 divide-stone-800/50"
                            : "bg-white border-stone-200 text-stone-800 shadow-stone-400/30 divide-stone-100"
                        }`}
                      >
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          Select Language Tab
                        </div>
                        <div className="py-1">
                          {selectableLanguages.map((lang) => {
                            const isAlreadyOpen = openLanguages.includes(lang);
                            return (
                              <button
                                key={lang}
                                onClick={() => {
                                  setLanguage(lang);
                                  setIsNewTabMenuOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                                  isAlreadyOpen
                                    ? "text-orange-500 font-semibold bg-orange-500/10 hover:bg-orange-500/20"
                                    : isDarkMode
                                      ? "hover:bg-stone-800/80 hover:text-orange-400"
                                      : "hover:bg-orange-50 hover:text-orange-600"
                                }`}
                              >
                                <span>{fileNameMap[lang] || lang}</span>
                                <span className="text-[10px] opacity-70 uppercase font-bold px-1.5 py-0.5 rounded bg-stone-500/10">
                                  {lang}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-stone-400 pr-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Monaco Engine</span>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                width="100%"
                language={monacoLanguage}
                value={userCode}
                theme={
                  isDarkMode ? IdeThemeMap[theme] || "vs-dark" : "vs-light"
                }
                onChange={(value) => setCode(value || "")}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: fontSize || 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  roundedSelection: true,
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                  wordWrap: wordWrap,
                  suggestOnTriggerCharacters: !disableAutocomplete,
                  quickSuggestions: !disableAutocomplete,
                }}
              />
            </div>
          </div>

          {/* Resizer Handle */}
          {!isCompactLayout && (
            <div
              onMouseDown={() => setIsDragging(true)}
              className={`w-1 cursor-col-resize hover:bg-orange-500 active:bg-orange-600 transition ${
                isDarkMode ? "bg-stone-800" : "bg-stone-200"
              }`}
            />
          )}

          {/* Right Panel: Tabs for Console, I/O & AI Agent */}
          <div
            style={{ width: isCompactLayout ? undefined : rightPanelWidth }}
            className={`flex flex-col border-l ${
              isDarkMode
                ? "bg-[#151619] border-stone-800"
                : "bg-white border-stone-200"
            } overflow-hidden shrink-0 ${isCompactLayout ? "w-full h-80" : ""}`}
          >
            {/* Header Tabs: Console, I/O, AI Agent & Metrics */}
            <div
              className={`h-10 px-3 border-b flex items-center justify-between ${
                isDarkMode
                  ? "bg-[#18191c] border-stone-800"
                  : "bg-stone-100 border-stone-200"
              }`}
            >
              <div className="flex items-center gap-1 font-mono text-xs font-semibold">
                <button
                  onClick={() => setActiveRightTab("console")}
                  className={`px-3 py-1 rounded-md transition ${
                    activeRightTab === "console"
                      ? isDarkMode
                        ? "bg-[#25272c] text-white"
                        : "bg-white text-stone-900 shadow-xs"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  📟 Console
                </button>
                <button
                  onClick={() => setActiveRightTab("io")}
                  className={`px-3 py-1 rounded-md transition ${
                    activeRightTab === "io"
                      ? isDarkMode
                        ? "bg-[#25272c] text-white"
                        : "bg-white text-stone-900 shadow-xs"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  📥 I/O
                </button>
                <button
                  onClick={() => setActiveRightTab("ai")}
                  className={`px-3 py-1 rounded-md flex items-center gap-1 transition ${
                    activeRightTab === "ai"
                      ? isDarkMode
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-emerald-100 text-emerald-700"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <span>✨</span>
                  <span>AI Agent</span>
                </button>
              </div>

              {/* Execution Time & Memory metric indicator */}
              <div className="flex items-center gap-2 font-mono text-xs text-stone-400">
                <span>{executionTime ? executionTime : "453 ms"}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* TAB CONTENT: CONSOLE */}
            {activeRightTab === "console" && (
              <div className="flex-1 flex flex-col p-4 overflow-auto font-mono text-xs relative">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-stone-800/40">
                  <span className="text-stone-400 text-[11px]">
                    Program Output (Stdout/Stderr)
                  </span>
                  {output && (
                    <button
                      onClick={handleCopyOutput}
                      className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] transition"
                    >
                      {copiedOutput ? "✓ Copied" : "📋 Copy"}
                    </button>
                  )}
                </div>

                <div className="flex-1 whitespace-pre-wrap leading-relaxed selection:bg-orange-500/30">
                  {output ? (
                    output
                  ) : (
                    <span className="text-stone-500 italic">
                      Click 'Run' (or press Ctrl+Enter) to execute your program
                      and view stdout logs here...
                    </span>
                  )}
                </div>

                {memoryUsage && (
                  <div className="mt-3 pt-2 border-t border-stone-800/40 flex justify-between text-[11px] text-stone-400">
                    <span>Memory: {memoryUsage}</span>
                    <span>
                      Status: {isRunning ? "Running..." : "Completed"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: I/O (Stdin Input) */}
            {activeRightTab === "io" && (
              <div className="flex-1 flex flex-col p-4 font-mono text-xs">
                <label className="text-stone-400 mb-2 text-[11px] flex justify-between">
                  <span>Standard Input (Stdin)</span>
                  <span className="text-stone-500">Optional</span>
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter inputs line by line (e.g. 10 20)..."
                  className={`flex-1 w-full p-3 rounded-xl border outline-none resize-none font-mono text-xs ${
                    isDarkMode
                      ? "bg-[#1a1b1f] border-stone-800 text-stone-100 placeholder:text-stone-600 focus:border-orange-500/60"
                      : "bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-orange-500/60"
                  }`}
                />
              </div>
            )}

            {/* TAB CONTENT: AI AGENT */}
            {activeRightTab === "ai" && (
              <div className="flex-1 flex flex-col p-4 font-mono text-xs overflow-auto">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>✨</span>
                    <span>RunMe AI Assistant</span>
                  </span>
                </div>

                {/* Preset Prompts */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <button
                    onClick={() =>
                      handleAiAsk("Explain this code step by step")
                    }
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition text-[11px]"
                  >
                    💡 Explain Code
                  </button>
                  <button
                    onClick={() =>
                      handleAiAsk("Find potential runtime bugs or logic issues")
                    }
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition text-[11px]"
                  >
                    🐞 Fix Bugs
                  </button>
                </div>

                {/* Query Input Box */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAiAsk()}
                    placeholder="Ask AI about code logic or errors..."
                    className={`flex-1 px-3 py-1.5 rounded-lg border outline-none text-xs ${
                      isDarkMode
                        ? "bg-[#1a1b1f] border-stone-800 text-stone-100 placeholder:text-stone-600"
                        : "bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400"
                    }`}
                  />
                  <button
                    onClick={() => handleAiAsk()}
                    disabled={isAiThinking}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    {isAiThinking ? "..." : "Ask"}
                  </button>
                </div>

                {/* AI Response Display */}
                <div
                  className={`flex-1 p-3 rounded-xl border overflow-y-auto leading-relaxed ${
                    isDarkMode
                      ? "bg-[#1a1b1f] border-stone-800 text-stone-200"
                      : "bg-stone-50 border-stone-200 text-stone-800"
                  }`}
                >
                  {isAiThinking ? (
                    <div className="flex items-center gap-2 text-stone-400 italic">
                      <span className="h-3 w-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                      <span>Analyzing code...</span>
                    </div>
                  ) : aiResponse ? (
                    <div className="whitespace-pre-wrap">{aiResponse}</div>
                  ) : (
                    <span className="text-stone-500 italic">
                      Ask a question above or click 'Explain Code' to generate
                      instant AI insights...
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM STATUS BAR                                                       */}
      {/* ========================================================================= */}
      <footer
        className={`h-7 px-4 border-t flex items-center justify-between text-[11px] font-mono ${
          isDarkMode
            ? "bg-[#151619] border-stone-800 text-stone-400"
            : "bg-stone-100 border-stone-200 text-stone-600"
        } z-20 shrink-0`}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span>✓</span>
            <span>Ready</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(isDarkMode ? "github" : "dracula")}
            className="hover:text-stone-200 transition flex items-center gap-1"
          >
            <span>{isDarkMode ? "Dark" : "Light"}</span>
            <span>🔃</span>
          </button>
          <span className="hover:text-stone-200 transition cursor-pointer">
            Wiki 💬
          </span>
          <span className="px-2 py-0.5 rounded bg-stone-800 text-orange-400 font-bold">
            {selectedLanguage.toUpperCase()}
          </span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 4. EDITOR SETTINGS MODAL (Matching Screenshot 2 exact styling)             */}
      {/* ========================================================================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-[#141416] border border-stone-800 text-stone-100 rounded-2xl w-[440px] max-w-full shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <h2 className="font-bold text-base tracking-tight text-white">
                Editor Settings
              </h2>
              <button
                onClick={closeSettings}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition"
                aria-label="Close Settings"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs font-sans">
              {/* Option 1: Font Size */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-200 text-sm">
                    Font size
                  </div>
                  <div className="text-stone-400 text-[11px]">8–32px</div>
                </div>
                <div className="flex items-center gap-3 bg-[#1e1f24] border border-stone-800 rounded-xl px-3 py-1.5 font-mono">
                  <button
                    onClick={() => setFontSize(fontSize - 1)}
                    className="text-stone-400 hover:text-white text-base font-bold transition px-1"
                  >
                    -
                  </button>
                  <span className="font-bold text-stone-100 min-w-8 text-center">
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => setFontSize(fontSize + 1)}
                    className="text-stone-400 hover:text-white text-base font-bold transition px-1"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Option 2: Theme Segmented Toggle */}
              <div className="flex items-center justify-between">
                <div className="font-bold text-stone-200 text-sm">Theme</div>
                <div className="flex items-center bg-[#1e1f24] border border-stone-800 rounded-xl p-1 font-mono">
                  <button
                    onClick={() => setTheme("github")}
                    className={`px-3 py-1 rounded-lg transition text-xs flex items-center gap-1.5 ${
                      !isDarkMode
                        ? "bg-[#2d2f36] text-white font-bold shadow-xs"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <span>☀️</span>
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dracula")}
                    className={`px-3 py-1 rounded-lg transition text-xs flex items-center gap-1.5 ${
                      isDarkMode
                        ? "bg-[#2d2f36] text-white font-bold shadow-xs"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <span>🌙</span>
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Option 3: Editor Segmented Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-200 text-sm">Editor</div>
                  <div className="text-stone-400 text-[11px]">
                    On mobile, Ace is always used.
                  </div>
                </div>
                <div className="flex items-center bg-[#1e1f24] border border-stone-800 rounded-xl p-1 font-mono">
                  <button
                    onClick={() => setEditorType("monaco")}
                    className={`px-3 py-1 rounded-lg transition text-xs ${
                      editorType === "monaco"
                        ? "bg-[#2d2f36] text-white font-bold shadow-xs"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Monaco
                  </button>
                  <button
                    onClick={() => setEditorType("ace")}
                    className={`px-3 py-1 rounded-lg transition text-xs ${
                      editorType === "ace"
                        ? "bg-[#2d2f36] text-white font-bold shadow-xs"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Ace
                  </button>
                </div>
              </div>

              {/* Option 4: Word Wrap iOS Switch */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-200 text-sm">
                    Word wrap
                  </div>
                  <div className="text-stone-400 text-[11px]">
                    Wrap long lines to fit the editor width
                  </div>
                </div>
                <button
                  onClick={() => setWordWrap(wordWrap === "on" ? "off" : "on")}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    wordWrap === "on" ? "bg-blue-600" : "bg-stone-700"
                  }`}
                  role="switch"
                  aria-checked={wordWrap === "on"}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                      wordWrap === "on" ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Option 5: Disable Auto-complete iOS Switch */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-200 text-sm">
                    Disable auto-complete
                  </div>
                  <div className="text-stone-400 text-[11px]">
                    Stop suggesting completions as you type
                  </div>
                </div>
                <button
                  onClick={() => setDisableAutocomplete(!disableAutocomplete)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    disableAutocomplete ? "bg-blue-600" : "bg-stone-700"
                  }`}
                  role="switch"
                  aria-checked={disableAutocomplete}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                      disableAutocomplete ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={resetSettings}
                className="text-stone-400 hover:text-stone-200 text-xs hover:underline cursor-pointer"
              >
                Reset to defaults
              </button>
              <button
                onClick={closeSettings}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-2 rounded-xl transition shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
