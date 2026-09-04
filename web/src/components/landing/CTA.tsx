import { ArrowRight, CarFront, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
          <CarFront size={25} />
        </div>

        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700">
          <Sparkles size={14} />
          Your next commute could be shared
        </div>

        <h2 className="mt-5 text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
          Find your way.
          <br />
          <span className="text-blue-600">Together.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          Join a smarter community of everyday commuters and make every
          journey more affordable, connected and efficient.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Get started
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/find-ride"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            Find a ride
          </Link>
        </div>
      </div>
    </section>
  );
}