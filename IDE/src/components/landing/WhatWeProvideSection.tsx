import { provides } from "./landingData"

const provideIcons = [
  // Instant Code Execution
  <svg key="1" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
  // Professional IDE
  <svg key="2" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6A2.25 2.25 0 0018.75 3.75H5.25A2.25 2.25 0 003 6v12A2.25 2.25 0 005.25 20.25z" />
  </svg>,
  // Real Output & Metrics
  <svg key="3" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>,
]

export function WhatWeProvideSection() {
  return (
    <section className="mt-16 sm:mt-24">
      <div className="max-w-2xl">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          Core Capability
        </span>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Code, compile, and run instantly.
        </h2>
        <p className="mt-2 text-stone-600 text-sm">
          Everything you need to write and test code efficiently in your browser without local SDK installation.
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {provides.map((item, idx) => (
          <article
            key={item.title}
            className="group relative rounded-3xl border border-white/80 bg-white/80 p-7 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/20 shadow-xs transition-transform duration-300 group-hover:scale-110">
              {provideIcons[idx % provideIcons.length]}
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
