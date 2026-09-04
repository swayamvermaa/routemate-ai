import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function AIMatching() {
  return (
    <section className="overflow-hidden bg-slate-950 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* LEFT */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-400">
              <Sparkles size={14} />
              Intelligence behind every match
            </div>

            <h2 className="max-w-xl text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              Not just nearby.
              <br />
              <span className="text-blue-400">Actually compatible.</span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
              RouteMate doesn't simply find the closest ride. It evaluates
              multiple signals to find the journey that makes the most sense
              for both people.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Route similarity",
                "Departure time compatibility",
                "Pickup distance",
                "Contribution compatibility",
                "Community trust",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2 size={17} className="text-blue-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — AI CARD */}
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-7">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    RouteMate AI
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-white">
                    Best ride matches
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Sparkles size={18} />
                </div>
              </div>

              {/* Search */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10">
                    <MapPin size={15} className="text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      Your journey
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white">
                      Agra → Sharda University
                    </p>
                  </div>

                  <span className="text-xs font-medium text-slate-500">
                    8:00 AM
                  </span>
                </div>
              </div>

              {/* Match */}
              <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-5">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg">
                      👨🏻
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-white">
                          Rahul Sharma
                        </p>
                        <ShieldCheck
                          size={14}
                          className="text-blue-400"
                        />
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500">
                        ⭐ 4.8 · Verified student
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">
                      94%
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      match
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between text-[11px]">
                      <span className="text-slate-500">
                        Route similarity
                      </span>
                      <span className="font-semibold text-slate-300">
                        96%
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-[96%] rounded-full bg-blue-500" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-[11px]">
                      <span className="text-slate-500">
                        Time compatibility
                      </span>
                      <span className="font-semibold text-slate-300">
                        92%
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-[92%] rounded-full bg-blue-500" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-[11px]">
                      <span className="text-slate-500">
                        Pickup convenience
                      </span>
                      <span className="font-semibold text-slate-300">
                        89%
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-[89%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
                  <div>
                    <Clock3 size={14} className="text-slate-500" />
                    <p className="mt-2 text-xs font-semibold text-white">
                      8:05 AM
                    </p>
                    <p className="text-[10px] text-slate-600">
                      departure
                    </p>
                  </div>

                  <div>
                    <MapPin size={14} className="text-slate-500" />
                    <p className="mt-2 text-xs font-semibold text-white">
                      450m
                    </p>
                    <p className="text-[10px] text-slate-600">
                      pickup
                    </p>
                  </div>

                  <div>
                    <TrendingUp size={14} className="text-slate-500" />
                    <p className="mt-2 text-xs font-semibold text-white">
                      ₹35
                    </p>
                    <p className="text-[10px] text-slate-600">
                      contribution
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500">
                View matched ride
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}