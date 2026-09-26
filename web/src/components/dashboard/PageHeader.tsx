"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Back",
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backHref && (
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>
    </div>
  );
}