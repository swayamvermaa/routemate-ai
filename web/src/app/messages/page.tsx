export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-blue-600">
          Messages
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Your messages
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Chat with your ride partners and manage your conversations here.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-700">
            Messaging system coming next
          </p>
        </div>
      </div>
    </main>
  );
}