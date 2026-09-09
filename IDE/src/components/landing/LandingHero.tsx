import { useState } from "react"
import { languages } from "./landingData"

interface LandingHeroProps {
  onOpenCompiler: (langKey?: string) => void;
}

const languageColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  C: { bg: "bg-blue-500/10", text: "text-blue-700", border: "border-blue-200", accent: "from-blue-600 to-indigo-600" },
  "C++": { bg: "bg-indigo-500/10", text: "text-indigo-700", border: "border-indigo-200", accent: "from-indigo-600 to-blue-600" },
  Java: { bg: "bg-red-500/10", text: "text-red-700", border: "border-red-200", accent: "from-red-600 to-amber-600" },
  Python: { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-200", accent: "from-emerald-600 to-teal-600" },
  JavaScript: { bg: "bg-amber-500/10", text: "text-amber-700", border: "border-amber-200", accent: "from-amber-500 to-yellow-600" },
  Go: { bg: "bg-cyan-500/10", text: "text-cyan-700", border: "border-cyan-200", accent: "from-cyan-600 to-blue-500" },
  Rust: { bg: "bg-orange-500/10", text: "text-orange-700", border: "border-orange-200", accent: "from-orange-600 to-red-600" },
  TypeScript: { bg: "bg-sky-500/10", text: "text-sky-700", border: "border-sky-200", accent: "from-sky-600 to-blue-600" },
  "C#": { bg: "bg-purple-500/10", text: "text-purple-700", border: "border-purple-200", accent: "from-purple-600 to-violet-600" },
  PHP: { bg: "bg-violet-500/10", text: "text-violet-700", border: "border-violet-200", accent: "from-violet-600 to-purple-600" },
  Ruby: { bg: "bg-rose-500/10", text: "text-rose-700", border: "border-rose-200", accent: "from-rose-600 to-red-600" },
  Kotlin: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-700", border: "border-fuchsia-200", accent: "from-fuchsia-600 to-purple-600" },
  Swift: { bg: "bg-orange-500/10", text: "text-orange-700", border: "border-orange-200", accent: "from-orange-500 to-amber-600" },
  R: { bg: "bg-blue-600/10", text: "text-blue-800", border: "border-blue-200", accent: "from-blue-700 to-sky-600" },
  Bash: { bg: "bg-stone-500/10", text: "text-stone-700", border: "border-stone-200", accent: "from-stone-700 to-stone-900" },
}

const nameToKeyMap: Record<string, string> = {
  "C": "c",
  "C++": "cpp",
  "Java": "java",
  "Python": "python",
  "JavaScript": "javascript",
  "Go": "go",
  "Rust": "rust",
  "TypeScript": "typescript",
  "C#": "csharp",
  "PHP": "php",
  "Ruby": "ruby",
  "Kotlin": "kotlin",
  "Swift": "swift",
  "R": "r",
  "Bash": "bash"
}

export function LandingHero({ onOpenCompiler }: LandingHeroProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-6 shadow-[0_30px_90px_rgba(234,88,12,0.12)] backdrop-blur-xl md:p-10 lg:p-12">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-orange-400/25 via-amber-300/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tl from-red-500/20 via-orange-300/15 to-transparent blur-3xl" />

      <div className="relative z-10">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-4 py-1.5 backdrop-blur-md shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-wider text-orange-800 uppercase">
            RunMe · High-Performance Sandbox
          </span>
        </div>

        {/* Hero Title & Headline */}
        <div className="mt-6 max-w-4xl">
          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
            Code anywhere.{" "}
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
              Compile instantly.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
            Zero setup, zero friction. Write, compile, and debug 15+ programming languages in real time directly from your web browser with our high-speed execution API.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            onClick={() => onOpenCompiler()}
            aria-label="Launch Online Compiler Now"
            className="group relative inline-flex min-h-13 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 px-8 font-heading text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/40 active:scale-95"
          >
            <span>Launch Compiler Workspace</span>
            <svg
              className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <a
            href="#snippets"
            aria-label="Explore Code Templates"
            className="inline-flex min-h-13 items-center justify-center rounded-2xl border border-stone-200 bg-white/80 px-7 font-heading text-base font-semibold text-stone-800 shadow-xs transition-all duration-300 hover:bg-stone-50 hover:border-stone-300 hover:scale-[1.01]"
          >
            Explore Code Templates 🚀
          </a>
        </div>

        {/* Languages Header & Search Bar */}
        <div className="mt-12 pt-8 border-t border-stone-200/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Supported Compilers & Runtimes
              </h2>
              <p className="text-sm text-stone-500">
                Select any language to launch directly in the interactive compiler editor.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Filter languages (Python, C++...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-stone-200/90 bg-white/90 pl-10 pr-4 py-2 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Languages Grid */}
          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {filteredLanguages.map((language) => {
              const theme = languageColors[language.name] || languageColors.C
              const langKey = nameToKeyMap[language.name] || language.name.toLowerCase()
              return (
                <button
                  key={language.name}
                  onClick={() => onOpenCompiler(langKey)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white/90 p-4 text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/10"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-bold ${theme.bg} ${theme.text}`}
                    >
                      {language.short}
                    </span>
                    <span className="text-[11px] font-semibold text-orange-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Run →
                    </span>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-heading text-sm font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
                      {language.name}
                    </h3>
                    <p className="mt-1 text-xs text-stone-500 leading-normal line-clamp-2">
                      {language.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white/50 p-8 text-center">
              <p className="text-sm font-medium text-stone-500">
                No matching compilers found for "{searchTerm}".
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
