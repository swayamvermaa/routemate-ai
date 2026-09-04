import Link from "next/link";
import { ArrowRight, CarFront } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between rounded-2xl border border-slate-200/80 bg-white/85 px-4 shadow-lg shadow-slate-200/20 backdrop-blur-xl sm:px-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
              <CarFront size={21} strokeWidth={2.2} />
            </div>

            <div className="leading-none">
              <div className="text-[17px] font-bold tracking-tight text-slate-950">
                RouteMate
                <span className="text-blue-600"> AI</span>
              </div>

              <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Smart Mobility
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              How it works
            </Link>

            <Link
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Features
            </Link>

            <Link
              href="#safety"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Safety
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Get started
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Mobile button */}
          <button
            className="rounded-xl border border-slate-200 p-2.5 text-slate-700 sm:hidden"
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}