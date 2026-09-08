import { apiBenefits } from "./landingData"

export function APIBenefitsSection() {
  return (
    <section className="mt-16 sm:mt-24">
      <div className="max-w-2xl">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          Developer API
        </span>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Integrate multi-language execution into your products.
        </h2>
        <p className="mt-2 text-stone-600 text-sm">
          Power online coding platforms, LMS courses, automated grading, and interview technical assessments.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {apiBenefits.map((benefit) => (
          <article
            key={benefit.title}
            className="group relative rounded-3xl border border-stone-200/80 bg-white/85 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-orange-700 bg-orange-100/80 px-2.5 py-1 rounded-full">
                API Feature
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
              {benefit.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              {benefit.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
