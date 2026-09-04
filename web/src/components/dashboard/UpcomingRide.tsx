import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

export default function UpcomingRide() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Upcoming ride
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your next scheduled commute
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
          Confirmed
        </span>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-4">

        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full border-2 border-blue-600 bg-white" />

            <div className="my-1 h-12 border-l border-dashed border-slate-300" />

            <div className="h-3 w-3 rounded-full bg-blue-600" />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Pickup
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                Agra
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Destination
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                College
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          Tomorrow · 8:00 AM
        </span>

        <span className="flex items-center gap-1.5">
          <MapPin size={14} />
          4.2 km
        </span>
      </div>

      <Link
        href="/my-rides"
        className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
      >
        View ride
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}