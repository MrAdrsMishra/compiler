import { useState } from "react"
import { faqs } from "./landingData"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="mt-16 sm:mt-24">
      <div className="max-w-2xl">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
          Frequently Asked Questions
        </span>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Everything you need to know about RunMe.
        </h2>
        <p className="mt-2 text-stone-600 text-sm">
          Got questions about our compiler environment, execution sandboxing, or language features? Find answers below.
        </p>
      </div>

      <div className="mt-8 space-y-4 max-w-4xl">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className="rounded-3xl border border-stone-200/80 bg-white/85 shadow-xs backdrop-blur-md transition-all duration-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="flex w-full items-center justify-between p-6 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-heading text-base font-bold text-stone-900 pr-4">
                  {faq.question}
                </span>
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100/80 font-mono text-sm font-bold text-orange-700 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-orange-600 text-white" : ""
                  }`}
                >
                  ↓
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-stone-600 border-t border-stone-100 mt-2 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
