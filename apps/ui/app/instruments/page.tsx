import { buildDashboardViewModel } from "../../lib/view-models";

export default async function InstrumentsPage() {
  const dashboard = await buildDashboardViewModel();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Watchlist</p>
        <h1 className="text-3xl font-semibold text-ink">Tracked targets for market-impact monitoring</h1>
        <p className="max-w-3xl text-sm text-slate-300">
          These are the broad, sector, and macro-sensitive instruments WorldOS uses to anchor early impact reads.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboard.instruments.map((instrument) => (
          <article key={instrument.id} className="rounded-3xl border border-white/10 bg-panel p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{instrument.symbol}</p>
            <h2 className="mt-2 text-lg font-semibold text-ink">{instrument.name}</h2>
            <p className="mt-4 text-3xl font-semibold text-ink">{instrument.latestPrice.toFixed(2)}</p>
            <p className={instrument.changePct >= 0 ? "mt-2 text-sm text-emerald-300" : "mt-2 text-sm text-rose-300"}>
              {instrument.changePct >= 0 ? "+" : ""}
              {instrument.changePct.toFixed(2)}%
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
