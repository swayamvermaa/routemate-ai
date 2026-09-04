import { ArrowUpRight, CarFront } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  {
    label: "IG",
    href: "#",
  },
  {
    label: "in",
    href: "#",
  },
  {
    label: "X",
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <CarFront size={20} />
              </div>

              <div>
                <div className="text-lg font-bold">
                  RouteMate <span className="text-blue-400">AI</span>
                </div>

                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-slate-500">
                  Smart Mobility
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-6 text-slate-500">
              AI-powered hyperlocal carpooling for smarter everyday
              commutes.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs font-bold text-slate-500 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Product
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/find-ride"
                className="block text-sm text-slate-500 transition hover:text-white"
              >
                Find a ride
              </Link>

              <Link
                href="/offer-ride"
                className="block text-sm text-slate-500 transition hover:text-white"
              >
                Offer a ride
              </Link>

              <Link
                href="/dashboard"
                className="block text-sm text-slate-500 transition hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Company
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/#how-it-works"
                className="block text-sm text-slate-500 transition hover:text-white"
              >
                How it works
              </Link>

              <Link
                href="/#features"
                className="block text-sm text-slate-500 transition hover:text-white"
              >
                Features
              </Link>

              <Link
                href="/#safety"
                className="block text-sm text-slate-500 transition hover:text-white"
              >
                Safety
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Legal
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                href="/privacy"
                className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-white"
              >
                Privacy
                <ArrowUpRight size={12} />
              </Link>

              <Link
                href="/terms"
                className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-white"
              >
                Terms
                <ArrowUpRight size={12} />
              </Link>

              <Link
                href="/safety"
                className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-white"
              >
                Safety
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 RouteMate AI. All rights reserved.
          </p>

          <p>
            Smart Rides. Shared Costs. Better Commutes.
          </p>
        </div>
      </div>
    </footer>
  );
}