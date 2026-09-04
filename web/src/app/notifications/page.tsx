export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-blue-600">
          Notifications
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Your notifications
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Stay updated about ride requests, matches, messages, and other activity.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-700">
            Notifications coming next
          </p>
        </div>
      </div>
    </main>
  );
}