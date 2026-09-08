import { CodeEditor } from "../CodeEditor"
import useCustomizationStore from "../CustomizationStore"

export function CompilerPage() {
  const isFullscreen = useCustomizationStore((state) => state.isFullscreen)
  
  return (
    <section className={`${isFullscreen ? "p-0" : "bg-linear-to-b from-stone-50/50 to-stone-100/30 px-4 py-8 text-stone-900 sm:px-6 sm:py-12 lg:px-8 min-h-screen"}`}>
      <div className={`${isFullscreen ? "h-screen" : "mx-auto w-full max-w-7xl"}`}>
        {!isFullscreen && (
          <header className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-700">Interactive compiler</p>
            <h1 className="mt-3 font-serif text-3xl leading-tight text-stone-900 sm:text-5xl">
              RunMe: Write, compile, and run code online.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              Execute and test your code instantly across C, C++, Java, Python, JavaScript, Go, and Rust. Perfect for learning, interviews, and rapid prototyping.
            </p>
          </header>
        )}
        <CodeEditor />
      </div>
    </section>
  )
}
