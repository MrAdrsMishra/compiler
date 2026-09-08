import { accessFlow } from "./landingData"

export function HowToAccessSection() {
  return (
    <section className="mt-16 sm:mt-24">
      <div className="max-w-2xl">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          Workflow
        </span>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          5 simple steps to your first program.
        </h2>
        <p className="mt-2 text-stone-600 text-sm">
          Get started in seconds without downloading compilers, managing paths, or configuring environments.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-5">
        {accessFlow.map((step) => (
          <div
            key={step.step}
            className="group relative flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white/85 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 font-mono text-sm font-bold text-white shadow-md shadow-orange-500/25 transition-transform duration-300 group-hover:scale-110">
                0{step.step}
              </div>
              <h3 className="mt-4 font-heading text-base font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">
                {step.description}
              </p>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-stone-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 w-0 transition-all duration-500 group-hover:w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
