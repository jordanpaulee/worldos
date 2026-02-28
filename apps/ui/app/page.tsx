import { TimelineChart } from "../components/timeline-chart";
import { buildDashboardViewModel } from "../lib/view-models";

const getConfidenceTone = (label: string) => {
  if (label === "high") {
    return "bg-emerald-500/15 text-emerald-200";
  }

  if (label === "medium") {
    return "bg-amber-500/15 text-amber-200";
  }

  return "bg-slate-500/15 text-slate-300";
};

const getStatusTone = (status: "watching" | "active" | "cooling") => {
  if (status === "active") {
    return "bg-amber-500/15 text-amber-200";
  }

  if (status === "watching") {
    return "bg-emerald-500/15 text-emerald-200";
  }

  return "bg-slate-500/15 text-slate-300";
};

export default async function HomePage() {
  const dashboard = await buildDashboardViewModel();
  const topImpacts = dashboard.impacts.slice(0, 3);
  const topSignals = dashboard.signals.slice(0, 2);

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">WorldOS v0.1-alpha</p>
        <h1 className="max-w-4xl text-3xl font-semibold text-ink">
          See which public events may matter, which watchlist names moved, and which signals are starting to form.
        </h1>
        <p className="max-w-3xl text-sm text-slate-300">
          WorldOS turns public events and market snapshots into an early market-impact workspace. This alpha uses
          sample data, but the product shape is already visible: event intake, watchlist context, and ranked signals
          that can later become evidence-backed briefings and alerts.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <article key={stat.label} className="rounded-3xl border border-white/10 bg-panel p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold text-ink">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-300">{stat.detail}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Watchlist Impact Preview</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Possible catalysts behind observed moves</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Active
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                Watching
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-300/15 bg-slate-300/10 px-3 py-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300/70" />
                Cooling
              </span>
            </div>
          </div>
          <p className="max-w-md text-right text-sm text-slate-300">
            Bars show sample same-day ETF moves. Numbered markers point to the event WorldOS would flag for follow-up.
          </p>
        </div>

        <div className="mt-6">
          <TimelineChart points={dashboard.impactPreview} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {topImpacts.map((impact, index) => (
            <article key={impact.id} className="rounded-2xl border border-white/10 bg-panelAlt px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-bg">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{impact.instrumentSymbol}</p>
                  <h3 className="mt-1 font-medium text-ink">{impact.eventTitle}</h3>
                  <p className="mt-2 text-sm text-slate-300">{impact.narrative}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Potential Impact Reads</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">What WorldOS would tell you to investigate</h2>
            </div>
            <p className="max-w-xs text-right text-sm text-slate-300">
              These are sample hypotheses linking a public event to a watchlist move.
            </p>
          </div>
          <div className="mt-4 space-y-4">
            {topImpacts.map((impact) => (
              <article key={impact.id} className="rounded-2xl border border-white/10 bg-panelAlt p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{impact.instrumentSymbol}</p>
                    <h3 className="mt-1 font-medium text-ink">{impact.eventTitle}</h3>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${getStatusTone(impact.status)}`}>
                      {impact.status}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${getConfidenceTone(
                        dashboard.getConfidenceLabel(impact.confidenceScore),
                      )}`}
                    >
                      {dashboard.getConfidenceLabel(impact.confidenceScore)} confidence
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">{impact.narrative}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Observed move</p>
                    <p
                      className={
                        impact.observedMovePct >= 0
                          ? "mt-2 text-lg font-semibold text-emerald-200"
                          : "mt-2 text-lg font-semibold text-rose-200"
                      }
                    >
                      {impact.observedMovePct >= 0 ? "+" : ""}
                      {impact.observedMovePct.toFixed(2)}%
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Relevance</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{Math.round(impact.relevanceScore * 100)}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Expected horizon</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{impact.horizon}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Signals Taking Shape</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Patterns that may become ranked signals later</h2>
            <div className="mt-4 space-y-4">
              {topSignals.map((signal) => (
                <article key={signal.id} className="rounded-2xl border border-white/10 bg-panelAlt p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-ink">{signal.title}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${getConfidenceTone(
                        dashboard.getConfidenceLabel(signal.confidenceScore),
                      )}`}
                    >
                      {dashboard.getConfidenceLabel(signal.confidenceScore)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{signal.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1">
                      Horizon: {signal.horizon}
                    </span>
                    <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1">
                      State: {signal.stability}
                    </span>
                    <span className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1">
                      Direction: {signal.direction}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {signal.evidence.map((item) => (
                      <div key={item.headline} className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-3">
                        <p className="text-sm font-medium text-ink">{item.headline}</p>
                        <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Recent Events</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Public catalysts currently in view</h2>
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
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{event.occurredAt}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
