import { getMacroCalendarConnector, getPricesConnector } from "@chrona/connectors";
import {
  featureSchema,
  signalSchema,
  watchlistImpactSchema,
  type Event,
  type Feature,
  type Instrument,
  type Signal,
  type WatchlistImpact,
} from "@chrona/core-schema";

type ImpactBlueprint = {
  instrumentSymbol: string;
  eventId: string;
  possibleDirection: WatchlistImpact["possibleDirection"];
  relevanceScore: number;
  confidenceScore: number;
  horizon: string;
  status: WatchlistImpact["status"];
  narrative: string;
};

type ImpactPreviewPoint = {
  symbol: string;
  movePct: number;
  latestPrice: number;
  eventTitle?: string;
  narrative: string;
  relevanceScore: number;
  confidenceScore: number;
  horizon: string;
  status: WatchlistImpact["status"];
};

type StatCard = {
  label: string;
  value: string;
  detail: string;
};

export type DashboardViewModel = {
  instruments: Instrument[];
  events: Event[];
  impacts: WatchlistImpact[];
  features: Feature[];
  signals: Signal[];
  impactPreview: ImpactPreviewPoint[];
  stats: StatCard[];
  getConfidenceLabel: (score: number) => "high" | "medium" | "low";
};

export type DailyViewModel = {
  lead: string;
  marketSnapshot: Instrument[];
  eventHighlights: Event[];
};

const impactBlueprints: ImpactBlueprint[] = [
  {
    instrumentSymbol: "SPY",
    eventId: "event-cpi-us",
    possibleDirection: "mixed",
    relevanceScore: 0.82,
    confidenceScore: 0.64,
    horizon: "same day",
    status: "active",
    narrative: "Inflation data is a first-stop explanation for broad market positioning because it can reset rate expectations quickly.",
  },
  {
    instrumentSymbol: "QQQ",
    eventId: "event-fomc-minutes",
    possibleDirection: "mixed",
    relevanceScore: 0.88,
    confidenceScore: 0.68,
    horizon: "same day",
    status: "active",
    narrative: "Rate-sensitive growth names often react first when policy communication changes the path investors expect for yields.",
  },
  {
    instrumentSymbol: "XLE",
    eventId: "event-eurozone-pmi",
    possibleDirection: "positive",
    relevanceScore: 0.61,
    confidenceScore: 0.46,
    horizon: "1 to 3 days",
    status: "watching",
    narrative: "Growth-sensitive releases can spill into energy expectations when they change the demand backdrop investors are pricing.",
  },
  {
    instrumentSymbol: "TLT",
    eventId: "event-cpi-us",
    possibleDirection: "negative",
    relevanceScore: 0.9,
    confidenceScore: 0.71,
    horizon: "same day",
    status: "active",
    narrative: "Treasury duration is a direct read on inflation and rate expectations, so macro releases often show up here fastest.",
  },
  {
    instrumentSymbol: "UUP",
    eventId: "event-boj-briefing",
    possibleDirection: "mixed",
    relevanceScore: 0.58,
    confidenceScore: 0.43,
    horizon: "1 to 2 days",
    status: "watching",
    narrative: "Cross-border policy messaging can ripple through the dollar complex before it becomes obvious in broad risk assets.",
  },
  {
    instrumentSymbol: "GLD",
    eventId: "event-boj-briefing",
    possibleDirection: "positive",
    relevanceScore: 0.55,
    confidenceScore: 0.4,
    horizon: "1 to 3 days",
    status: "cooling",
    narrative: "Gold is useful as a cross-check when policy uncertainty and defensive positioning start to rise together.",
  },
];

const getConfidenceLabel = (score: number): "high" | "medium" | "low" => {
  if (score >= 0.7) {
    return "high";
  }

  if (score >= 0.5) {
    return "medium";
  }

  return "low";
};

const getAverage = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

const buildWatchlistImpacts = (instruments: Instrument[], events: Event[]): WatchlistImpact[] => {
  const instrumentMap = new Map(instruments.map((instrument) => [instrument.symbol, instrument]));
  const eventMap = new Map(events.map((event) => [event.id, event]));

  return impactBlueprints.flatMap((blueprint) => {
    const instrument = instrumentMap.get(blueprint.instrumentSymbol);
    const event = eventMap.get(blueprint.eventId);

    if (!instrument || !event) {
      return [];
    }

    return [
      watchlistImpactSchema.parse({
        id: `impact-${instrument.symbol.toLowerCase()}-${event.id}`,
        instrumentId: instrument.id,
        instrumentSymbol: instrument.symbol,
        eventId: event.id,
        eventTitle: event.title,
        narrative: blueprint.narrative,
        possibleDirection: blueprint.possibleDirection,
        observedMovePct: instrument.changePct,
        relevanceScore: blueprint.relevanceScore,
        confidenceScore: blueprint.confidenceScore,
        horizon: blueprint.horizon,
        status: blueprint.status,
        metadata: {
          latestPrice: instrument.latestPrice,
          occurredAt: event.occurredAt,
        },
      }),
    ];
  });
};

const buildFeatures = (instruments: Instrument[], events: Event[], impacts: WatchlistImpact[]): Feature[] => {
  const latestObservedAt = instruments[0]?.asOf ?? new Date().toISOString();
  const highImportanceEvents = events.filter((event) => event.importance === "high");
  const riskAssets = instruments.filter((instrument) => ["SPY", "QQQ", "IWM"].includes(instrument.symbol));
  const macroCrossChecks = instruments.filter((instrument) => ["TLT", "UUP", "GLD"].includes(instrument.symbol));

  return [
    featureSchema.parse({
      id: "feature-macro-pressure",
      kind: "macro_event_count",
      label: "Macro pressure",
      value: highImportanceEvents.length,
      unit: "high-priority events",
      observedAt: latestObservedAt,
      scope: {
        entityType: "market",
        entityId: "global-watchlist",
        window: "day",
      },
      sourceEventIds: highImportanceEvents.map((event) => event.id),
    }),
    featureSchema.parse({
      id: "feature-risk-appetite",
      kind: "market_move",
      label: "Risk appetite pulse",
      value: getAverage(riskAssets.map((instrument) => instrument.changePct)),
      unit: "% average move",
      observedAt: latestObservedAt,
      scope: {
        entityType: "market",
        entityId: "risk-assets",
        window: "day",
      },
      sourceEventIds: impacts
        .filter((impact) => ["SPY", "QQQ"].includes(impact.instrumentSymbol))
        .map((impact) => impact.eventId),
    }),
    featureSchema.parse({
      id: "feature-cross-asset-check",
      kind: "cross_asset_stress",
      label: "Cross-asset check",
      value: getAverage(macroCrossChecks.map((instrument) => Math.abs(instrument.changePct))),
      unit: "% average absolute move",
      observedAt: latestObservedAt,
      scope: {
        entityType: "market",
        entityId: "macro-cross-checks",
        window: "day",
      },
      sourceEventIds: impacts
        .filter((impact) => ["TLT", "UUP", "GLD"].includes(impact.instrumentSymbol))
        .map((impact) => impact.eventId),
    }),
    featureSchema.parse({
      id: "feature-catalyst-concentration",
      kind: "catalyst_concentration",
      label: "Catalyst concentration",
      value: getAverage(impacts.map((impact) => impact.relevanceScore)),
      unit: "average relevance score",
      observedAt: latestObservedAt,
      scope: {
        entityType: "market",
        entityId: "watchlist-catalysts",
        window: "day",
      },
      sourceEventIds: impacts.map((impact) => impact.eventId),
    }),
  ];
};

const buildSignals = (impacts: WatchlistImpact[]): Signal[] => {
  const signalBlueprints = [
    {
      id: "signal-rates-sensitive-growth",
      title: "Rates-sensitive growth is still first responder",
      summary: "Policy communication is showing up most clearly in growth-heavy watch targets, making QQQ a fast read on changing rate expectations.",
      targetSymbol: "QQQ",
      featureId: "feature-risk-appetite",
      direction: "mixed" as const,
      horizon: "same day to 2 days",
      stability: "watch" as const,
      confidenceScore: 0.66,
      evidence: [
        {
          headline: "Policy text hit growth proxies first",
          detail: "QQQ is one of the strongest same-day movers in the current sample set and is paired with FOMC minutes.",
        },
      ],
    },
    {
      id: "signal-duration-shock-absorber",
      title: "Treasury duration stays on the front line",
      summary: "TLT remains the cleanest watch target when inflation or policy events reset the expected path of rates.",
      targetSymbol: "TLT",
      featureId: "feature-cross-asset-check",
      direction: "downside" as const,
      horizon: "same day",
      stability: "watch" as const,
      confidenceScore: 0.71,
      evidence: [
        {
          headline: "Inflation-linked read-through",
          detail: "The sample CPI event is attached to TLT because duration is usually a first-pass rate sensitivity proxy.",
        },
      ],
    },
    {
      id: "signal-policy-cross-checks",
      title: "Dollar and gold are useful confirmation checks",
      summary: "Cross-asset proxies help confirm whether a policy event is staying local or spilling into a broader defensive positioning story.",
      targetSymbol: "UUP",
      featureId: "feature-catalyst-concentration",
      direction: "mixed" as const,
      horizon: "1 to 3 days",
      stability: "emerging" as const,
      confidenceScore: 0.49,
      evidence: [
        {
          headline: "Defensive proxies moved together",
          detail: "UUP and GLD are both being tracked as policy-sensitive confirmation instruments in the alpha watchlist.",
        },
      ],
    },
  ];

  const impactMap = new Map(impacts.map((impact) => [impact.instrumentSymbol, impact]));

  return signalBlueprints.flatMap((blueprint) => {
    const targetImpact = impactMap.get(blueprint.targetSymbol);

    if (!targetImpact) {
      return [];
    }

    return [
      signalSchema.parse({
        id: blueprint.id,
        title: blueprint.title,
        summary: blueprint.summary,
        targetInstrumentId: targetImpact.instrumentId,
        featureId: blueprint.featureId,
        direction: blueprint.direction,
        horizon: blueprint.horizon,
        stability: blueprint.stability,
        confidenceScore: blueprint.confidenceScore,
        evidence: blueprint.evidence,
        metadata: {
          sourceEventId: targetImpact.eventId,
          sourceEventTitle: targetImpact.eventTitle,
        },
      }),
    ];
  });
};

const buildImpactPreview = (impacts: WatchlistImpact[], instruments: Instrument[]): ImpactPreviewPoint[] => {
  const instrumentMap = new Map(instruments.map((instrument) => [instrument.id, instrument]));

  return impacts.map((impact) => {
    const instrument = instrumentMap.get(impact.instrumentId);

    return {
      symbol: impact.instrumentSymbol,
      movePct: impact.observedMovePct,
      latestPrice: instrument?.latestPrice ?? 0,
      eventTitle: impact.eventTitle,
      narrative: impact.narrative,
      relevanceScore: impact.relevanceScore,
      confidenceScore: impact.confidenceScore,
      horizon: impact.horizon,
      status: impact.status,
    };
  });
};

export const buildDashboardViewModel = async (): Promise<DashboardViewModel> => {
  const pricesConnector = getPricesConnector();
  const macroConnector = getMacroCalendarConnector();
  const [instruments, events] = await Promise.all([pricesConnector.fetch(), macroConnector.fetch()]);
  const impacts = buildWatchlistImpacts(instruments, events);
  const features = buildFeatures(instruments, events, impacts);
  const signals = buildSignals(impacts);

  return {
    instruments,
    events,
    impacts,
    features,
    signals,
    impactPreview: buildImpactPreview(impacts, instruments),
    stats: [
      { label: "Public events in focus", value: String(events.length), detail: "Current macro catalysts in the alpha feed" },
      { label: "Watchlist names tracked", value: String(instruments.length), detail: "Broad, sector, and macro-sensitive ETFs" },
      { label: "Impact reads surfaced", value: String(impacts.length), detail: "Possible event-to-market relationships in view" },
      { label: "Signals taking shape", value: String(signals.length), detail: "Early patterns worth watching next" },
    ],
    getConfidenceLabel,
  };
};

export const buildDailyViewModel = async (): Promise<DailyViewModel> => {
  const pricesConnector = getPricesConnector();
  const macroConnector = getMacroCalendarConnector();
  const [instruments, events] = await Promise.all([pricesConnector.fetch(), macroConnector.fetch()]);

  return {
    lead: "A sample morning snapshot of the watchlist, the public events most likely to matter, and the signals Chrona is preparing to rank over time.",
    marketSnapshot: instruments.slice(0, 3),
    eventHighlights: events.slice(0, 4),
  };
};
