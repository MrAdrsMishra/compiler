import { useState, useEffect } from "react"
import { LandingPage } from "./components/landing/LandingPage"
import { Navbar } from "./components/Navbar"
import { CompilerPage } from "./pages/CompilerPage"
import useCustomizationStore from "./CustomizationStore"
import { LANGUAGE_ROUTES, getLanguageKeyFromSlug, getSlugForLanguage } from "./utils/routing"
import "./index.css"

type Page = 'home' | 'compiler'

function App() {
  const selectedLanguage = useCustomizationStore((state) => state.selectedLanguage)
  const setLanguage = useCustomizationStore((state) => state.setLanguage)

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Check initial path or hash for language routes like /online_python_compiler
    const path = window.location.pathname
    const hash = window.location.hash.replace("#", "")
    const langFromPath = getLanguageKeyFromSlug(path) || getLanguageKeyFromSlug(hash)
    if (langFromPath) {
      setLanguage(langFromPath)
      return 'compiler'
    }
    if (path.includes('compiler') || hash.includes('compiler')) {
      return 'compiler'
    }
    return 'home'
  })

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      const hash = window.location.hash.replace("#", "")
      const langFromPath = getLanguageKeyFromSlug(path) || getLanguageKeyFromSlug(hash)
      if (langFromPath) {
        setLanguage(langFromPath)
        setCurrentPage('compiler')
      } else if (path.includes('compiler') || hash.includes('compiler')) {
        setCurrentPage('compiler')
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setLanguage])

  // Update SEO metadata & canonical tags whenever page or active language changes
  useEffect(() => {
    let title = "Online C, C++, Java, Python, Go, Rust & JavaScript Compiler | RunMe"
    let description = "Run code online instantly with RunMe - a fast, responsive online compiler for C, C++, Java, Python, JavaScript, Go, and Rust. Enjoy unlimited free browser execution."
    let canonicalUrl = "https://onlinecompiler.me/"

    if (currentPage === 'compiler') {
      const routeInfo = LANGUAGE_ROUTES[selectedLanguage]
      if (routeInfo) {
        title = routeInfo.title
        description = routeInfo.description
        canonicalUrl = `https://onlinecompiler.me/${routeInfo.slug}`
      } else {
        title = "Interactive Online Compiler Workspace | RunMe"
        description = "Write, compile, and run C, C++, Java, Python, JavaScript, Go, and Rust code live in your browser."
        canonicalUrl = "https://onlinecompiler.me/compiler"
      }
    }

    document.title = title

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', description)

    const canonicalLink = document.querySelector('link[rel="canonical"]')
    if (canonicalLink) canonicalLink.setAttribute('href', canonicalUrl)
  }, [currentPage, selectedLanguage])

  const handleNavigate = (page: Page, langKey?: string) => {
    if (langKey) {
      setLanguage(langKey)
      setCurrentPage('compiler')
      const slug = getSlugForLanguage(langKey)
      window.history.pushState({ page: 'compiler', lang: langKey }, '', `/${slug}`)
    } else if (page === 'compiler') {
      setCurrentPage('compiler')
      const slug = getSlugForLanguage(selectedLanguage)
      window.history.pushState({ page: 'compiler' }, '', `/${slug}`)
    } else {
      setCurrentPage('home')
      window.history.pushState({ page: 'home' }, '', '/')
    }
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Navbar onNavigate={(p) => handleNavigate(p)} currentPage={currentPage} />
      {currentPage === 'home' && (
        <LandingPage
          onOpenCompiler={(langKey) => handleNavigate('compiler', langKey)}
        />
      )}
      {currentPage === 'compiler' && <CompilerPage />}
    </>
  )
}

export default App
