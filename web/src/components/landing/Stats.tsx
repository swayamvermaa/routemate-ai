import {
  CarFront,
  Leaf,
  IndianRupee,
  Users,
} from "lucide-react";

const stats = [
  {
    icon: CarFront,
    value: "1,240+",
    label: "Shared rides",
  },
  {
    icon: IndianRupee,
    value: "₹58K+",
    label: "Travel costs shared",
  },
  {
    icon: Leaf,
    value: "420 kg",
    label: "Estimated CO₂ reduced",
  },
  {
    icon: Users,
    value: "2,800+",
    label: "Community members",
  },
];

export default function Stats() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="rounded-[30px] border border-slate-200 bg-slate-950 p-7 sm:p-10 lg:p-12">

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                    <Icon size={19} />
                  </div>

                  <div>
                    <p className="text-2xl font-bold tracking-tight text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {stat.label}
                    </p>
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