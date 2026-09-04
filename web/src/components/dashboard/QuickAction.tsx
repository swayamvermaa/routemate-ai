import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";

type QuickActionProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export default function QuickAction({
  title,
  description,
  href,
  icon: Icon,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>

        <ArrowUpRight
          size={18}
          className="text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600"
        />
      </div>

      <h3 className="mt-5 font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}