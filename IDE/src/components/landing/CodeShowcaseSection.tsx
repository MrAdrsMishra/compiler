import { useState } from "react"
import { codeSnippets, type CodeSnippet } from "./landingData"
import useCustomizationStore from "../../CustomizationStore"

interface CodeShowcaseSectionProps {
  onOpenCompiler: () => void
}

export function CodeShowcaseSection({ onOpenCompiler }: CodeShowcaseSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("cpp")
  const setLanguage = useCustomizationStore((state) => state.setLanguage)
  const setCode = useCustomizationStore((state) => state.setCode)

  const currentSnippet: CodeSnippet =
    codeSnippets.find((s) => s.langKey === activeTab) || codeSnippets[0]

  const handleLaunchSnippet = (snippet: CodeSnippet) => {
    setLanguage(snippet.langKey)
    setCode(snippet.code)
    onOpenCompiler()
  }

  return (
    <section id="snippets" className="mt-16 sm:mt-24">
      <div className="max-w-2xl">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          Code Snippets & Templates
        </span>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Explore algorithm & language templates.
        </h2>
        <p className="mt-2 text-stone-600 text-sm">
          Select pre-built algorithmic templates below and click to run them instantly in your online IDE workspace.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-stone-200/90 bg-stone-900 shadow-2xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-stone-800 bg-stone-950/80 px-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs font-semibold text-stone-400">
              Template Explorer
            </span>
          </div>

          {/* Language Selector Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {codeSnippets.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => setActiveTab(snippet.langKey)}
                className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-semibold transition-all duration-200 ${
                  activeTab === snippet.langKey
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30"
                    : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                }`}
              >
                {snippet.language}
              </button>
            ))}
          </div>
        </div>

        {/* Code Content Body */}
        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-white">
                {currentSnippet.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {currentSnippet.description}
              </p>
            </div>

            <button
              onClick={() => handleLaunchSnippet(currentSnippet)}
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-2.5 font-heading text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/40 active:scale-95"
            >
              <span>Run in Compiler Workspace</span>
              <span className="transform transition-transform group-hover:translate-x-1">⚡</span>
            </button>
          </div>

          {/* Code Container */}
          <div className="mt-5 rounded-2xl border border-stone-800 bg-stone-950 p-4 font-mono text-xs leading-relaxed text-stone-200 overflow-x-auto selection:bg-orange-500/40">
            <pre>
              <code>{currentSnippet.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
