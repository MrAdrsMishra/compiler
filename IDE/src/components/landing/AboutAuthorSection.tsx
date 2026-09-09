export function AboutAuthorSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="mt-16 sm:mt-24 mb-16">
      <div className="rounded-[2.5rem] border border-stone-200/80 bg-white/85 p-8 shadow-xl backdrop-blur-xl sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          {/* Avatar & Info */}
          <div className="flex flex-col items-start">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 shadow-xl shadow-orange-500/25 ring-4 ring-white">
                <span className="font-heading text-4xl font-extrabold text-white">A</span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" title="Active Developer">
                <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
              </span>
            </div>
            <h3 className="mt-5 font-heading text-2xl font-extrabold text-stone-900">
              Adarsh Mishra
            </h3>
            <p className="mt-1 font-mono text-xs font-semibold text-orange-600 uppercase tracking-wider">
              Creator & Lead Engineer
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-orange-100/80 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                Full-Stack & Systems Developer
              </span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
              About The Creator
            </span>
            <h2 id="about-heading" className="mt-2 font-heading text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Built for developers, by a developer.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
              RunMe was created to solve the friction of software setup. Whether you are practicing Data Structures and Algorithms in C++, testing Python scripts, or benchmarking Java snippets, RunMe gives you an instant, zero-config workspace powered by secure remote execution containers.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="mailto:adarshmishra.dev@gmail.com"
                className="group inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
              >
                <span>Get in touch via Email</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="https://github.com/MrAdrsMishra/compiler-VM"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white/80 px-5 py-2.5 text-xs font-bold text-stone-800 shadow-xs transition-all duration-300 hover:bg-stone-50 hover:border-stone-400"
              >
                <span>View GitHub Repository</span>
                <svg className="h-4 w-4 text-stone-600" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
