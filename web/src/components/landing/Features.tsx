import {
  Bot,
  Leaf,
  MapPinned,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Ride Matching",
    description:
      "Find rides based on route similarity, departure time, pickup distance, contribution and trust.",
    large: true,
  },
  {
    icon: MapPinned,
    title: "Smart Pickup",
    description:
      "Get a convenient meeting point that balances passenger walking distance and rider detour.",
  },
  {
    icon: WalletCards,
    title: "Shared Travel Costs",
    description:
      "Make everyday commuting more affordable by sharing reasonable travel costs.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Community",
    description:
      "Profiles, ratings, verification, reports and privacy controls help build safer connections.",
  },
  {
    icon: Leaf,
    title: "Track Your Impact",
    description:
      "See how much money, fuel and estimated CO₂ you save through shared journeys.",
  },
  {
    icon: Sparkles,
    title: "Daily Commute Intelligence",
    description:
      "Recurring rides make your regular Home → College or Home → Office journey easier.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-white py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700">
              <Sparkles size={14} />
              Everything you need
            </div>

            <h2 className="text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">
              More than a ride.
              <br />
              <span className="text-blue-600">A smarter commute.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            RouteMate combines intelligent matching, community trust and
            everyday convenience into one connected mobility experience.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`group rounded-3xl border border-slate-200 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40 ${
                  feature.large
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    feature.large
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 shadow-sm"
                  }`}
                >
                  <Icon size={21} />
                </div>

                <div className="mt-8 flex items-start justify-between gap-4">
                  <h3
                    className={`text-xl font-bold ${
                      feature.large
                        ? "text-white"
                        : "text-slate-950"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  <span
                    className={`text-xs font-bold ${
                      feature.large
                        ? "text-slate-600"
                        : "text-slate-300"
                    }`}
                  >
                    0{index + 1}
                  </span>
                </div>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    feature.large
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  {feature.description}
                </p>

                {feature.large && (
                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Example match
                      </span>

                      <span className="font-bold text-blue-400">
                        94%
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-[94%] rounded-full bg-blue-500" />
                    </div>

                    <div className="mt-3 flex justify-between text-[11px] text-slate-500">
                      <span>Route similarity</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}