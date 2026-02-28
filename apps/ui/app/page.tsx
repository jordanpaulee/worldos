import { TimelineChart } from "../components/timeline-chart";
import { buildDashboardViewModel } from "../lib/view-models";

export default async function HomePage() {
  const dashboard = await buildDashboardViewModel();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">WorldOS v0.1-alpha</p>
        <h1 className="text-3xl font-semibold text-ink">Ingestion to interface, with no heavy modeling</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          This shell demonstrates the minimal path from fixture-backed ingestion through normalized records and into
          a timeline-oriented UI overlay.
        </p>
      </header>

      <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Timeline Overlay</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Macro events against instrument drift</h2>
          </div>
          <p className="max-w-lg text-right text-sm text-slate-300">
            Overlaying normalized macro events on a compact market proxy view is enough to validate the UX spine for
            the alpha.
          </p>
        </div>

        <div className="mt-6">
          <TimelineChart points={dashboard.timeline} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Recent Events</p>
          <div className="mt-4 space-y-4">
            {dashboard.events.map((event) => (
              <article key={event.id} className="rounded-2xl border border-white/10 bg-panelAlt p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-ink">{event.title}</h3>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
                    {event.importance}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{event.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Instrument Board</p>
          <div className="mt-4 space-y-3">
            {dashboard.instruments.slice(0, 6).map((instrument) => (
              <div key={instrument.id} className="flex items-center justify-between rounded-2xl bg-panelAlt px-4 py-3">
                <div>
                  <p className="font-medium text-ink">{instrument.symbol}</p>
                  <p className="text-xs text-slate-400">{instrument.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-ink">{instrument.latestPrice.toFixed(2)}</p>
                  <p className={instrument.changePct >= 0 ? "text-xs text-emerald-300" : "text-xs text-rose-300"}>
                    {instrument.changePct >= 0 ? "+" : ""}
                    {instrument.changePct.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
