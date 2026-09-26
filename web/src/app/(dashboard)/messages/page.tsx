import PageHeader from "@/components/dashboard/PageHeader";

export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Communication"
          title="Your messages"
          description="Chat with passengers and ride providers."
          backHref="/dashboard"
          backLabel="Back to Dashboard"
        />

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-700">
            Messaging system coming next
          </p>
        </div>
      </div>
    </main>
  );
}