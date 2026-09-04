import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AIRecommendation() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-sm">

      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Sparkles size={18} />
          </div>

          <p className="text-sm font-bold">
            RouteMate AI
          </p>
        </div>

        <h3 className="mt-6 text-lg font-bold">
          A smarter route match may be waiting.
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          3 commuters are travelling along your usual
          route tomorrow morning.
        </p>

        <Link
          href="/find-ride"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Find matching rides
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}