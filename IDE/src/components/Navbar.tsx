interface NavbarProps {
  onNavigate: (page: 'home' | 'compiler') => void;
  currentPage: 'home' | 'compiler';
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50">
      <nav
        className="glass-nav transition-all duration-300 shadow-xs"
        aria-label="Main Navigation"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] text-left"
            aria-label="RunMe Compiler Home"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 shadow-md shadow-orange-500/30 ring-2 ring-white/80 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/40">
              <svg
                className="h-5 w-5 text-white transform transition-transform duration-300 group-hover:rotate-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-bold tracking-tight text-stone-900">
                  RunMe
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Engine Live
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-500 tracking-wide">
                Instant Multi-Language IDE
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('home')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                currentPage === 'home'
                  ? 'bg-orange-100/90 text-orange-800 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('compiler')}
              className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
                currentPage === 'compiler'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30'
                  : 'bg-gradient-to-r from-stone-900 to-stone-800 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-stone-900/10 hover:shadow-orange-500/25 hover:-translate-y-0.5'
              }`}
            >
              <span>Launch Compiler</span>
              <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-0.5">
                ⚡
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
