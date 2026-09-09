import { features } from "./landingData"

const featureIcons = [
  // Unlimited Free Runs
  <svg key="1" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>,
  // 15 Languages
  <svg key="2" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>,
  // Real-time Feedback
  <svg key="3" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  // API Ready
  <svg key="4" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>,
  // Mobile Friendly
  <svg key="5" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>,
  // Customizable
  <svg key="6" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072" />
  </svg>,
]

export function FeaturesSection() {
  return (
    <section className="mt-16 sm:mt-24">
      <div className="max-w-2xl">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          Why Choose RunMe
        </span>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Built for speed, power, and simplicity.
        </h2>
        <p className="mt-2 text-stone-600 text-sm">
          Designed from the ground up for students, competitive programmers, developers, and educators.
        </p>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <article
            key={feature.title}
            className="group relative rounded-3xl border border-stone-200/80 bg-white/85 p-6 shadow-[0_15px_40px_rgba(120,53,15,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100/80 text-orange-700 shadow-xs transition-transform duration-300 group-hover:scale-110">
              {featureIcons[idx % featureIcons.length]}
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
