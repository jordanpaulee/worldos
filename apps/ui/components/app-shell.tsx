import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";

const navigation = [
  { href: "/", label: "Timeline" },
  { href: "/briefing/daily", label: "Daily Briefing" },
  { href: "/instruments", label: "Instruments" }
];

const inspectorNotes = [
  "Using sample ETF data for now.",
  "Economic event feed is a placeholder and can be swapped later.",
  "API and worker layers share normalized schemas from @worldos/core-schema."
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <aside className="rounded-[32px] border border-white/10 bg-panel p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">WorldOS</p>
          <h1 className="mt-3 text-2xl font-semibold text-ink">Public world graph</h1>
          <p className="mt-3 text-sm text-slate-300">
            Early version focused on core data flow for event ingestion, normalization, and overlay analysis.
          </p>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:border-accent hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="rounded-[32px] border border-white/10 bg-[rgba(7,17,31,0.72)] p-6 shadow-soft backdrop-blur">
          {children}
        </main>

        <aside className="rounded-[32px] border border-white/10 bg-panel p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-warning">Inspector</p>
          <h2 className="mt-3 text-xl font-semibold text-ink">Alpha constraints</h2>
          <p className="mt-3 text-sm text-slate-300">
            No prediction engine, no heavy modeling, no globe. The current shape exists to prove the ingestion-to-UI
            spine.
          </p>
          <Separator className="my-6 h-px w-full bg-white/10" />
          <div className="space-y-4">
            {inspectorNotes.map((note) => (
              <article key={note} className="rounded-2xl border border-white/10 bg-panelAlt p-4 text-sm text-slate-300">
                {note}
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
