"use client";

import PageHeader from "@/components/dashboard/PageHeader";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Settings"
        title="App preferences"
        description="Manage your RouteMate preferences and account settings."
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />

      <div className="space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">
            Notifications
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Notification preferences will be available
            when the messaging and booking system is
            connected.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">
            Privacy & safety
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Safety controls, trusted contacts and privacy
            settings will be added in the upcoming
            safety module.
          </p>
        </section>
      </div>
    </div>
  );
}