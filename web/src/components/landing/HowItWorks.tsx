import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Create or find a ride",
    description:
      "Tell RouteMate where you're going, when you're travelling, and what kind of ride you need.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI finds your match",
    description:
      "Our matching engine compares routes, timing, pickup distance, contribution and trust.",
  },
  {
    number: "03",
    icon: Users,
    title: "Connect & confirm",
    description:
      "Review the rider, pickup point and ride details before requesting to join.",
  },
  {
    number: "04",
    icon: MapPin,
    title: "Travel together",
    description:
      "Meet at the suggested pickup point, share the journey and reduce your travel cost.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-50 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-sm">
            <Sparkles size={14} />
            Simple by design
          </div>

          <h2 className="text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">
            Your journey,
            <span className="text-blue-600"> made smarter.</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            RouteMate removes the complexity from everyday carpooling.
            Find people going your way and travel together.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">

          {/* Connecting line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-slate-200 lg:block" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Icon size={21} />
                      </div>

                      <span className="text-xs font-bold tracking-widest text-slate-300">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-lg font-bold text-slate-950">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-green-600">
                      <CheckCircle2 size={14} />
                      Built for everyday travel
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-14 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
            Less empty seats.
            <ArrowRight size={15} />
            More shared journeys.
          </div>
        </div>
      </div>
    </section>
  );
}