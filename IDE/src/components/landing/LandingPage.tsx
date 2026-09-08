import { ContactSection } from "./ContactSection"
import { FeaturesSection } from "./FeaturesSection"
import { LandingHero } from "./LandingHero"
import { WhatWeProvideSection } from "./WhatWeProvideSection"
import { HowToAccessSection } from "./HowToAccessSection"
import { APIBenefitsSection } from "./APIBenefitsSection"
import { CodeShowcaseSection } from "./CodeShowcaseSection"
import { FAQSection } from "./FAQSection"
import { AboutAuthorSection } from "./AboutAuthorSection"

interface LandingPageProps {
  onOpenCompiler: (langKey?: string) => void;
}

export function LandingPage({ onOpenCompiler }: LandingPageProps) {
  return (
    <main className="bg-[linear-gradient(180deg,#faf7f2_0%,#f5efe6_42%,#fffbf7_100%)] px-4 py-6 text-stone-900 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <LandingHero onOpenCompiler={onOpenCompiler} />
        <WhatWeProvideSection />
        <CodeShowcaseSection onOpenCompiler={onOpenCompiler} />
        <FeaturesSection />
        <HowToAccessSection />
        <APIBenefitsSection />
        <FAQSection />
        <ContactSection />
        <AboutAuthorSection />
      </div>
    </main>
  )
}
