import {
  Ban,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";

const safetyFeatures = [
  {
    icon: UserCheck,
    title: "Verified profiles",
    description:
      "Build trust with profile verification and community information.",
  },
  {
    icon: Star,
    title: "Ratings & reviews",
    description:
      "See previous ride experiences before connecting with someone.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy controls",
    description:
      "Keep sensitive contact information private until you choose to share it.",
  },
  {
    icon: Ban,
    title: "Block & report",
    description:
      "Quickly report inappropriate behaviour or block another user.",
  },
];

export default function Safety() {
  return (
    <section
      id="safety"
      className="bg-slate-50 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">

          {/* Left */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3.5 py-2 text-xs font-semibold text-green-700">
              <ShieldCheck size={14} />
              Community-first safety
            </div>

            <h2 className="text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">
              Travel with
              <br />
              <span className="text-blue-600">more confidence.</span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
              Trust is a core part of RouteMate. We give riders and passengers
              the tools to understand who they're travelling with and stay in
              control of their information.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <ShieldCheck size={21} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Safety is built into the journey
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Verification · Privacy · Reporting
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="grid gap-4 sm:grid-cols-2">
            {safetyFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-green-600">
                    <CheckCircle2 size={14} />
                    Designed for community trust
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}