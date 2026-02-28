import { buildDailyViewModel } from "../../../lib/view-models";

export default async function DailyBriefingPage() {
  const briefing = await buildDailyViewModel();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Daily Briefing</p>
        <h1 className="text-3xl font-semibold text-ink">Today&apos;s market-aware public world signal snapshot</h1>
        <p className="max-w-3xl text-sm text-slate-300">{briefing.lead}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {briefing.marketSnapshot.map((item) => (
          <article key={item.symbol} className="rounded-3xl border border-white/10 bg-panel p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.symbol}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{item.latestPrice.toFixed(2)}</p>
            <p className={item.changePct >= 0 ? "mt-2 text-sm text-emerald-300" : "mt-2 text-sm text-rose-300"}>
              {item.changePct >= 0 ? "+" : ""}
              {item.changePct.toFixed(2)}%
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-ink">Event Highlights</h2>
        <div className="mt-4 space-y-4">
          {briefing.eventHighlights.map((event) => (
            <article key={event.id} className="rounded-2xl border border-white/10 bg-panelAlt p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-ink">{event.title}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
                  {event.importance}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{event.occurredAt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
