import Link from "next/link";
import { CarFront, CheckCircle2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Branding Section */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <CarFront size={22} />
              </div>

              <div>
                <p className="text-lg font-bold text-white">
                  RouteMate{" "}
                  <span className="text-blue-400">AI</span>
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                  Smart Mobility
                </p>
              </div>
            </Link>

            {/* Main Message */}
            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-400">
                <CheckCircle2 size={14} />

                Welcome back
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-[-0.04em] text-white xl:text-5xl">
                Your everyday commute,
                <br />

                <span className="text-blue-400">
                  made smarter.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Find compatible rides, connect with trusted commuters
                and share travel costs on routes you already travel.
              </p>

              {/* Benefits */}
              <div className="mt-10 space-y-4">
                {[
                  "AI-powered ride matching",
                  "Trusted community profiles",
                  "Save money on everyday travel",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-blue-400">
                      <CheckCircle2 size={17} />
                    </div>

                    <p className="text-sm text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-slate-600">
              Smart Rides. Shared Costs. Better Commutes.
            </p>
          </div>
        </section>

        {/* Right Login Section */}
        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <CarFront size={20} />
                </div>

                <p className="text-lg font-bold text-slate-950">
                  RouteMate{" "}
                  <span className="text-blue-600">
                    AI
                  </span>
                </p>
              </Link>
            </div>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}