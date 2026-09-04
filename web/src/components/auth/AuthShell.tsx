import { ArrowLeft, CarFront, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthShell({
  children,
  title,
  subtitle,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex w-full flex-col p-10 xl:p-14">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <CarFront size={21} />
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  RouteMate <span className="text-blue-400">AI</span>
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                  Smart Mobility
                </p>
              </div>
            </Link>

            {/* Center */}
            <div className="my-auto max-w-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <Sparkles size={21} />
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em] text-white xl:text-5xl">
                Your everyday commute,
                <br />
                <span className="text-blue-400">
                  made smarter.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Find people travelling your way, share the journey,
                and make everyday commuting more affordable.
              </p>

              <div className="mt-9 flex items-center gap-3 text-sm text-slate-400">
                <ShieldCheck size={18} className="text-blue-400" />
                Built around privacy, trust and community.
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Smart Rides. Shared Costs. Better Commutes.
            </p>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-h-screen flex-col bg-white">

          {/* Mobile header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <CarFront size={18} />
              </div>

              <span className="font-bold text-slate-900">
                RouteMate <span className="text-blue-600">AI</span>
              </span>
            </Link>

            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
            >
              <ArrowLeft size={17} />
            </Link>
          </div>

          {/* Form */}
          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
            <div className="w-full max-w-md">

              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-[-0.035em] text-slate-950">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {subtitle}
                </p>
              </div>

              {children}

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}