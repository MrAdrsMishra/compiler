import { useState, type FormEvent } from "react"

export function ContactSection() {
  const [status, setStatus] = useState("")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const mobile = String(form.get("mobile") ?? "").trim()
    const requirement = String(form.get("requirement") ?? "").trim()

    const subject = encodeURIComponent(`Compiler API Enquiry from ${name || "website visitor"}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nRequirement: ${requirement}`,
    )

    setStatus("Opening your email client with your enquiry details...")
    window.location.href = `mailto:adarshmishra.dev@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="mt-16 sm:mt-24">
      <div className="rounded-[2.5rem] border border-stone-200/80 bg-white/85 p-8 shadow-xl backdrop-blur-xl sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Left Column info */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
              Get In Touch
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Get in Touch & Feedback
            </h2>
            <p className="mt-4 text-base leading-relaxed text-stone-600">
              Have suggestions, feature requests, API questions, or feedback? Drop us a message and we'll get back to you promptly.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-stone-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100/80 text-orange-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-stone-400">Direct Email</p>
                  <p className="text-sm font-semibold text-stone-900">adarshmishra.dev@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-stone-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100/80 text-orange-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-stone-400">Response SLA</p>
                  <p className="text-sm font-semibold text-stone-900">Within 24 Hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-semibold text-stone-700">
                Full Name
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Adarsh Mishra"
                  className="min-h-12 rounded-2xl border border-stone-200 bg-stone-50/50 px-4 text-sm text-stone-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-stone-700">
                Email Address
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="min-h-12 rounded-2xl border border-stone-200 bg-stone-50/50 px-4 text-sm text-stone-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-stone-700 sm:col-span-2">
                Mobile Number
                <input
                  name="mobile"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="min-h-12 rounded-2xl border border-stone-200 bg-stone-50/50 px-4 text-sm text-stone-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-stone-700 sm:col-span-2">
                Project Requirement / API Usage
                <textarea
                  name="requirement"
                  rows={4}
                  required
                  placeholder="Describe your use case, required compiler languages, and expected compilation volume."
                  className="rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 font-heading text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/35 active:scale-95"
              >
                Send Enquiry
              </button>
              {status ? (
                <p className="text-xs font-semibold text-orange-700">{status}</p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
