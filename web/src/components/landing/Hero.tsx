import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-50/70 blur-3xl" />

        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-indigo-50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">

          {/* LEFT */}
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700">
              <Sparkles size={14} />
              AI-powered community carpooling
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[68px]">
              Find someone
              <br />
              <span className="text-blue-600">going your way.</span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Share your everyday journey with people travelling along a
              similar route. RouteMate AI finds better matches, smarter
              pickup points and affordable cost-sharing rides.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/find-ride"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Find a ride
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/offer-ride"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Offer a ride
              </Link>
            </div>

            {/* Trust */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-600" />
                Verified community
              </div>

              <div className="flex items-center gap-2">
                <Users size={15} className="text-blue-600" />
                Cost sharing
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-indigo-600" />
                Smart pickup
              </div>
            </div>
          </div>

          {/* RIGHT — MATCH PREVIEW */}
          <div className="relative mx-auto w-full max-w-[520px]">

            {/* Map container */}
            <div className="relative h-[470px] overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-300/30">

              {/* Fake map background */}
              <div className="absolute inset-0 opacity-70">
                <div className="absolute left-[15%] top-0 h-full w-px rotate-[28deg] bg-white" />
                <div className="absolute left-[48%] top-[-10%] h-[120%] w-[2px] rotate-[62deg] bg-white" />
                <div className="absolute left-[75%] top-[-10%] h-[120%] w-px rotate-[105deg] bg-white" />

                <div className="absolute left-0 top-[28%] h-[2px] w-full rotate-[8deg] bg-white" />
                <div className="absolute left-0 top-[62%] h-px w-full rotate-[-12deg] bg-white" />
                <div className="absolute left-0 top-[82%] h-px w-full rotate-[4deg] bg-white" />
              </div>

              {/* Route */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 520 470"
                fill="none"
              >
                <path
                  d="M90 390 C150 350 145 270 230 250 C315 230 300 145 420 90"
                  stroke="#2563EB"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="12 10"
                />
              </svg>

              {/* Start */}
              <div className="absolute bottom-[15%] left-[13%]">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
                    <MapPin size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="absolute right-[15%] top-[13%]">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950">
                    <MapPin size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Rider marker */}
              <div className="absolute left-[53%] top-[43%]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-xl shadow-xl">
                  🚗
                </div>
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-md">
                  Rahul · 450m
                </div>
              </div>

              {/* Floating AI card */}
              <div className="absolute left-5 right-5 top-5 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur-xl sm:left-6 sm:right-auto sm:w-[275px]">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Sparkles size={15} />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        AI match
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        Excellent route
                      </p>
                    </div>
                  </div>

                  <div className="text-lg font-bold text-blue-600">
                    94%
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[94%] rounded-full bg-blue-600" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    Route
                    <span className="ml-1 font-bold text-slate-800">
                      96%
                    </span>
                  </div>

                  <div>
                    Time
                    <span className="ml-1 font-bold text-slate-800">
                      92%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom ride card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl">
                      👨🏻
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-slate-900">
                          Rahul Sharma
                        </p>
                        <CheckCircle2
                          size={13}
                          className="text-blue-600"
                        />
                      </div>

                      <p className="text-xs text-slate-500">
                        ⭐ 4.8 · Verified student
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-950">
                      ₹35
                    </p>
                    <p className="text-[10px] text-slate-400">
                      contribution
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock3 size={13} />
                    8:05 AM
                  </div>

                  <div className="flex items-center gap-1.5 font-medium text-slate-600">
                    <MapPin size={13} />
                    450m pickup
                  </div>

                  <div className="font-semibold text-green-600">
                    1 seat
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="pointer-events-none absolute -bottom-8 -right-8 -z-10 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}