# **Chrona Design Doc v0.1**

## **Financial-Aware Public World Intelligence Graph (Open Source, Infrastructure-First)**

### **Status**

Draft v0.1 for the Chrona fork.

---

## **1\) Purpose**

Chrona is an open-source platform that ingests public data streams, normalizes them into a time-aware entity/event graph, computes features, and surfaces **ranked, evidence-backed insights** through:

* **Daily briefing** (scheduled, curated, narrative \+ charts)

* **Hourly updates** (lightweight, “what changed” \+ watchlist-impact)

* **WorldView UI** (Palantir/WorldView-like interface for spatial \+ multi-domain layers)

Chrona is not a trading bot and does not provide financial advice. It is a **research and situational awareness substrate** for public signals and their historical relationships to market behavior.

---

## 

## 

## 

## 

## **2\) Guiding Constraints**

### **Legal/ToS discipline**

* Prefer licensed feeds, official APIs, RSS/Atom, public datasets.

* If a source forbids scraping/redistribution, Chrona either:

  * does not ingest it, or

  * ingests only allowable metadata, or

  * requires user-supplied API keys and local-only storage.

### **Engineering discipline**

* Store **raw** cheaply; store **semantics** richly; compute **models** in batch.

* LLMs are *optional enrichment*, not the ingestion pipeline.

* Assume noisy inputs; prioritize provenance and reproducibility.

---

## **3\) User Experience Goals**

### **Daily briefing (morning)**

A structured report answering:

* What were the largest market moves (broad \+ sectors \+ key commodities)?

* What world events likely mattered (with citations/provenance)?

* What signals are currently “elevated” based on Chrona features?

* What comparable historical episodes exist?

* What to watch next (calendar \+ upcoming catalysts)?

### **Hourly updates (through the day)**

A lightweight delta feed:

* What new events arrived?

* Which watch targets were impacted (exposure \+ relevance)?

* Any unusual clusters forming (novelty / rarity)?

### **WorldView (interactive)**

A unified operating picture:

* map layers (weather, ports/traffic summaries if permitted, geopolitical events)

* timeline scrubber

* entity graph view

* “investigation workspace” (pin entities/events and generate briefings)

---

## **4\) Scope Strategy**

Chrona starts **finance-first** because markets provide objective targets and feedback loops. The platform is designed to expand into broader “world app” capabilities (news/weather/traffic hubs) without rewriting core infrastructure.

---

## 

## 

## 

## 

## **5\) Core Concepts**

### **5.1 Entities**

Stable objects in the world model.

**Entity types (v0.1)**

* `MarketInstrument` (ETF, index, commodity proxy, FX proxy)

* `Sector` (GICS-like)

* `Organization` (optional in v0.1; can be phase 2\)

* `Country/Region`

* `Location` (for geo-linked events)

* `RegulatoryBody`

* `EventTopic` (taxonomy node)

### **5.2 Events**

Atomic, timestamped occurrences with provenance.

**Canonical Event**

* `event_id`

* `event_type` (policy, macro release, weather alert, corporate filing, headline cluster, etc.)

* `observed_at` (when it happened)

* `ingested_at`

* `entities[]` (refs)

* `geo` (optional)

* `source_id`

* `source_ref` (URL/id)

* `confidence` (0–1)

* `attributes` (typed payload)

### **5.3 Features**

Computed signals from events aggregated onto a consistent time axis.

Examples:

* “SevereWeatherIndex(region, day)”

* “PolicyEventCount(country, day)”

* “HeadlineTopicRate(topic, day)”

* “MacroSurprise(event, day)” (if you compute surprises)

* “ClusterNoveltyScore(cluster, hour)”

### **5.4 Signals**

Ranked hypotheses that certain features historically lead/lag certain targets.

A signal is not “truth”; it’s a scored association.

**Signal record**

* `signal_id`

* `target_instrument`

* `feature_id`

* `lag_window` (e.g., \+5d, \+10d, \+15d)

* `effect_size_distribution`

* `stability_score`

* `significance_controls` (how it was validated)

* `failure_modes` (known confounders, regime sensitivity)

* `examples[]` (historical episodes)

---

## **6\) Targets**

“Most likely profitable and affectable targets” in practice means: **high liquidity, stable history, broad linkage to world events**. v0.1 targets should avoid microcaps and idiosyncratic names.

### **v0.1 Target Set (recommended)**

**Broad**

* SPY (S\&P 500 proxy)

* QQQ (Nasdaq proxy)

* IWM (small caps proxy)

**Sectors**

* XLE (energy)

* XLF (financials)

* XLK (tech)

* XLI (industrials)

* XLY (consumer discretionary)

* XLP (staples)

* XLV (healthcare)

**Macro / rates / USD / vol**

* TLT (long duration proxy) or a rates proxy ETF

* UUP (USD proxy)

* GLD (gold)

* USO (oil proxy)

* VIX proxy (or volatility index data if accessible)

This set is “world-sensitive” and broad enough to model without drowning in entity resolution early.

---

## **7\) World Domains (Most likely to have impact)**

### **v0.1 Domain Sources (impact-first)**

1. **Macro calendar \+ releases** (CPI, jobs, Fed, GDP—official sources where feasible)

2. **Central bank / policy announcements** (Fed, Treasury, major counterparts if desired)

3. **Weather disruptions** (official alerts \+ severe events; hurricanes, major storms)

4. **Headlines (permitted feeds)** clustered into topics (not full-text scraping-first)

5. **Energy-related geopolitics** (sanctions updates, major diplomatic announcements)

### **v0.2+**

* Corporate disclosures (SEC filings) and high-level company events

* Supply chain summaries (port congestion indices, shipping rates, not raw tracking)

* More geopolitics/regulation

---

## **8\) System Architecture**

### **8.1 Components**

**A) Source Registry**

* Declarative catalog of connectors with:

  * license/terms reference

  * redistribution rules

  * retention guidance

  * required attribution text

  * rate limit policy

**B) Ingestion Service (Acquisition Workers)**

* Pulls from registered sources

* Stores minimal metadata

* Performs dedupe (URL canonicalization, content hash, ETag/Last-Modified)

* Emits “raw items” to a queue

**C) Normalization Service**

* Converts raw items into canonical `Events`

* Attaches preliminary entities (deterministic mapping when possible)

* Writes to Event Store

**D) Enrichment Service (Optional / Bounded)**

* Topic classification

* Entity resolution improvements

* Duplicate story clustering

* Embeddings (only for items that survive filters)

**E) Feature Factory**

* Scheduled jobs compute daily/hourly features from events

* Writes to Feature Store

**F) Discovery Engine**

* Batch jobs (daily) test features vs targets at multiple lags

* Walk-forward validation \+ stability scoring

* Writes Signal Store

**G) Serving API**

* Query entities/events/features/signals

* Generates daily briefing payload

* Generates hourly delta payload

* Provides “Explain” artifacts (evidence \+ charts \+ comparable historical episodes)

**H) Frontend(s)**

* Terminal UI (briefings, timeline, signals)

* WorldView UI (map layers, timeline scrubber, investigation workspace)

### **8.2 Queues and Backpressure**

* `raw_items_queue` (acquisition → normalization)

* `enrichment_queue` (only for eligible items)

* `feature_jobs_queue` (scheduled \+ event-triggered)

* `briefing_jobs_queue` (daily)

Backpressure means: if enrichment/modeling lags, ingestion continues while heavy steps are deferred.

---

## **9\) Storage Strategy (Lightweight, fast)**

### **Hot (serving)**

* **Postgres**: entities, events, sources, investigations, signal summaries

* **Time-series**: prices \+ computed features (Postgres \+ Timescale extension is fine early)

### **Warm (analytics)**

* Aggregated feature tables (daily/hourly)

* Cluster tables (headline clusters, event clusters)

### **Cold (object store)**

* Compressed raw artifacts *when allowed* (SEC docs, gov PDFs, permitted full text)

* Parquet exports for batch recomputation/backfills

**Design principle:** You should be able to rebuild features and signals from cold storage \+ event store.

---

## **10\) Modeling Approach (Local-first, “light” by default)**

### **10.1 Don’t start with “train our own model”**

Start with:

* deterministic parsing

* lightweight classifiers

* simple statistical discovery

* a local LLM used *only* for structured extraction and summarization when needed

### **10.2 Local model roles (v0.1)**

Use a local model for:

* topic classification (headline → topic)

* structured extraction into JSON (event type \+ entities \+ confidence)

* short summaries for briefing

Use embeddings locally for:

* duplicate detection / clustering

* semantic search in investigations

### **10.3 Cloud escalation (optional)**

Only for:

* “Explain this move” long-form narrative synthesis

* tricky disambiguation cases

Hard caps:

* token budget per day

* max calls per hour

* only when watchlist relevance score is high

### **10.4 “Discovery” is mostly statistics, not LLM**

Your “Mumbai rain → banana stock” dream is discovered by:

* feature generation

* lead/lag testing

* stability filters  
   Not by prompting an LLM.

---

## **11\) Discovery Engine (How you find weird relationships without fooling yourself)**

### **11.1 Candidate feature generation**

Features should be:

* indexed by time bucket (hour/day)

* indexed by entity/region/topic

* numeric (counts, indices, rates, severities)

### **11.2 Targets**

* forward returns at horizons: 1d, 3d, 5d, 10d, 15d

* volatility changes (optional)

### **11.3 Validation and anti-spurious controls (must-have)**

* Walk-forward testing (train on past window, evaluate on next)

* Stability scoring (sign consistency, effect distribution, regime robustness)

* Multiple-hypothesis control (FDR-style controls)

* Minimum sample thresholds (no “3 examples \-\> strong signal”)

### **11.4 Signal ranking**

Rank by:

* stability score

* effect size consistency (median, IQR)

* novelty (is it newly elevated now?)

* relevance (watchlist exposure, market regime)

Output always includes evidence:

* the feature series

* the target series

* the lag relationship

* the historical episode list

---

## **12\) Briefings and Updates**

### **12.1 Daily Briefing Generator**

Inputs:

* overnight signals ranked

* last day market moves

* major events and clusters

* upcoming macro calendar (next 24–72h)

Outputs:

* “Top moves”

* “Top candidate causes” (with citations)

* “Elevated signals to watch”

* “Comparable historical episodes”

* “Next catalysts”

### **12.2 Hourly Update Generator**

Inputs:

* newly ingested events

* updated clusters

* watchlist exposures

Outputs:

* delta feed with relevance scores

* “new cluster forming” notices

* “signal elevated” notices

---

## **13\) WorldView / Palantir-like Interface Plan**

### **13.1 WorldView is a view, not the engine**

WorldView consumes the same APIs:

* events

* entities

* features

* signals

### **13.2 WorldView v0.1 Features**

* Map with layer toggles:

  * severe weather

  * major geopolitical/policy events (country markers)

  * macro calendar events (global markers)

* Timeline scrubber: filter events by time window

* Investigation workspace:

  * pin entities/regions/topics

  * see event clusters and relevant signals

* Drill-down pane:

  * show evidence \+ linked sources

  * show market overlays for selected targets

### **13.3 WorldView v0.2+**

* richer geo layers (traffic/ports only if legally sourced)

* 3D globe/tiles as purely aesthetic \+ navigation layer (optional)

* “what changed in my AOI” briefs

---

## **14\) MVP Definition (v0.1)**

### **v0.1 Goal**

Deliver a working substrate that produces:

* daily briefing

* hourly delta updates

* signal discovery (basic)

* a WorldView-lite map \+ timeline

### **v0.1 Minimal Source Set (5 connectors)**

1. Market prices (targets above)

2. Macro calendar \+ releases (official)

3. Central bank announcements

4. Weather alerts (official)

5. News headlines via permitted feeds (RSS/Atom)

### 

### **v0.1 Deliverables**

* Source registry \+ connector interface

* Ingestion \+ normalization \+ event store

* Feature factory (daily \+ hourly aggregates)

* Discovery engine (daily batch)

* API \+ UI:

  * watchlist dashboard

  * timeline overlay chart

  * daily briefing page

  * hourly updates feed

  * WorldView-lite (map \+ layers \+ scrubber)

---

## **15\) Performance and Cost Controls (Core Design)**

### **Storage control**

* cold store raw only when allowed

* warm store only aggregates and typed attributes

* aggressively dedupe (URL normalization \+ hashes)

* TTL policies by source class

### 

### 

### 

### **Compute control**

* enrichment only for items with high relevance/novelty

* batch feature generation and discovery jobs

* precompute briefing artifacts

### **Model cost control**

* local model default for enrichment

* cloud only on high-value summarization/explain tasks

* daily budgets and hard caps

---

## **16\) Repository Layout (recommended)**

chrona/  
 apps/  
   api/  
   ui-terminal/  
   ui-worldview/  
 packages/  
   core-schema/        (Event/Entity/Feature/Signal types)  
   source-registry/  
   ingestion/  
   normalization/  
   enrichment/  
   feature-factory/  
   discovery-engine/  
   backtests/  
 connectors/  
   market-prices/  
   macro-calendar/  
   central-bank/  
   weather/  
   news-feeds/  
 infra/  
   docker/  
   migrations/  
 docs/  
   design/  
   sources/  
   contributing/

---

## **17\) Build Plan (phased, realistic)**

### **Phase 0 — Skeleton (weekend)**

* schema package

* source registry

* event store \+ basic API

### **Phase 1 — Ingestion \+ Briefing Backbone**

* 2 connectors (prices \+ macro calendar)

* daily briefing template (without fancy AI)

* watchlist UI \+ timeline overlay

### **Phase 2 — World domains \+ Hourly updates**

* weather \+ news feed connectors

* clustering of headlines

* hourly delta feed

### **Phase 3 — Discovery v0**

* feature factory (daily aggregates)

* lag tests \+ stability scoring

* top signals page \+ evidence charts

### 

### 

### **Phase 4 — WorldView-lite**

* map layers

* investigation workspace basics

---

## **18\) Open Source Strategy**

### **License**

If “power to the people” is primary and you want to discourage closed SaaS forks:

* **AGPLv3** is consistent.

If adoption \+ contributions is primary:

* **Apache-2.0** is the cleanest.

### **Contribution safety**

* connectors must include terms metadata

* no PRs accepted that add disallowed sources or ToS-violating scraping

* provide a “connector template” that bakes in compliance fields

## 

## 

## 

## 

## 

## **Appendix A — Tech Stack & Infrastructure Blueprint**

### **(Palantir-Style Design \+ High-Throughput Public Data Engine)**

This appendix defines the technical stack and infrastructure decisions for Chrona v0.1, optimized for:

* High information density (Foundry-like UX)

* Multi-domain data ingestion

* Efficient storage \+ compute

* Local-first modeling

* Hourly updates \+ daily briefings

* Modular open-source extensibility

---

# **A.1 Architectural Principles**

1. **Infrastructure first, UI second.**

2. **Batch modeling; real-time serving.**

3. **LLMs as enrichment, not ingestion.**

4. **Hot/warm/cold data separation.**

5. **Modular connectors with compliance metadata.**

6. **Watchlist-first for relevance control (expand later).**

---

# **A.2 Frontend Stack (Palantir-Style Operations UI)**

### **Framework**

* **Next.js (React) \+ TypeScript**

  * App Router

  * API routes optional (primary API lives in backend service)

  * Strong typing shared via schema package

### **Styling & Design System**

* **TailwindCSS**

  * Dark-first theme

  * Design tokens via CSS variables (colors, spacing, density)

* **Radix UI primitives**

* **shadcn/ui** as component scaffolding layer

### **Data Interaction**

* **TanStack Table**

  * Core for dense, filterable, drilldown-heavy tables

* **TanStack Query**

  * Client caching and background refetching

* **Zustand**

  * Lightweight state management for workspace state

### **Layout & Interaction**

* `react-resizable-panels`

* `cmdk` (command palette)

* Keyboard-first navigation patterns

### **Visualization**

* **ECharts**

  * Price overlays, lag sliders, distribution charts

* **MapLibre GL**

  * Map rendering (open-source Mapbox-compatible)

* **deck.gl**

  * Geo overlays, clustering, heatmaps

* **Cytoscape.js** (or React Flow)

  * Entity/event relationship graph

---

# **A.3 Backend Stack**

### **API Layer**

* **Node.js \+ TypeScript**

* **Fastify**

  * High performance

  * Minimal overhead

  * Plugin-friendly

  * Strong schema validation

*(NestJS acceptable if more structure desired, but Fastify preferred for lean performance.)*

---

# **A.4 Data Storage Strategy**

## **Primary Database**

* **PostgreSQL**

  * Entities

  * Events

  * Signals

  * Source registry

  * Investigations

* Add **TimescaleDB extension** for time-series optimization

* Add **pgvector** for embeddings (optional)

## **Cache \+ Queue**

* **Redis**

  * BullMQ job queues

  * Rate limiting

  * Caching frequent queries

  * Pub/Sub for hourly updates

## 

## 

## **Object Storage (Cold Tier)**

* **S3-compatible storage**

  * MinIO locally

  * S3 in production

* Store:

  * Raw artifacts (when allowed)

  * Compressed documents

  * Parquet exports for batch analytics

---

# **A.5 Job & Ingestion Architecture**

### **Queue System**

* **BullMQ (Redis-based)**

Queues:

* `raw_ingest_queue`

* `normalize_queue`

* `enrichment_queue`

* `feature_queue`

* `discovery_queue`

* `briefing_queue`

### **Worker Types**

1. Acquisition Worker

2. Normalization Worker

3. Enrichment Worker

4. Feature Factory Worker

5. Discovery Worker

6. Briefing Generator Worker

Backpressure ensures ingestion continues even if enrichment lags.

---

# **A.6 Modeling & ML Stack**

## **Local-First Strategy**

### **Inference Runtime**

* **Ollama** (local orchestration)

### **Use Cases for Local Model**

* Headline/topic classification

* Structured extraction → JSON

* Entity disambiguation assistance

* Embeddings for clustering/search

* Brief summaries

### 

### **Cloud Model (Optional, Budgeted)**

Only for:

* Long-form narrative explanations

* Complex reasoning cases

* High-value summarization

Hard caps:

* Daily token budget

* Per-hour usage ceiling

* Relevance gating (watchlist-triggered only)

---

# **A.7 Discovery Engine Infrastructure**

### **Feature Store**

* Stored in Postgres/Timescale (v0.1)

* Daily and hourly aggregates

* Numeric feature vectors

### **Batch Analytics**

* Use SQL \+ window functions initially

* Optional future addition:

  * **DuckDB** for local analytics

  * **ClickHouse** for large-scale scanning

### **Validation Methods**

* Walk-forward testing

* Stability scoring

* False discovery rate control

* Minimum sample thresholds

No heavy LLM involvement in signal discovery.

---

# **A.8 Real-Time Updates**

### **Protocol**

* **Server-Sent Events (SSE)** for v0.1

  * Lightweight

  * Simpler than WebSockets

* Move to WebSockets only if bi-directional interaction required

---

# **A.9 WorldView Integration**

WorldView is a view layer over the same API.

### **WorldView Components**

* Layer manager

* Time scrubber

* Map overlays

* Investigation workspace

* Drilldown inspector

Powered by:

* Same Event Store

* Same Feature Store

* Same Signal Store

No duplicate logic.

---

# **A.10 Monorepo Structure**

chrona/  
 apps/  
   api/  
   ui-terminal/  
   ui-worldview/  
 packages/  
   core-schema/  
   source-registry/  
   ingestion/  
   normalization/  
   enrichment/  
   feature-factory/  
   discovery-engine/  
 connectors/  
   market-prices/  
   macro-calendar/  
   central-bank/  
   weather/  
   news-feeds/  
 infra/  
   docker/  
   migrations/  
 docs/  
   design/

Managed via:

* **pnpm \+ Turborepo**

---

# **A.11 Deployment Philosophy**

### **Development**

* Docker Compose:

  * Postgres

  * Redis

  * MinIO

  * Ollama

  * API

  * Workers

  * UI

### **Production (future)**

* Containerized services

* Horizontal worker scaling

* Object storage externalized

* Redis clustered if needed

---

# **A.12 Performance Strategy**

1. Aggressive deduplication at ingestion.

2. Only store normalized event data hot.

3. Batch feature generation (not per-request).

4. Precompute briefing artifacts.

5. Limit enrichment to high-relevance items.

6. Keep discovery jobs offline and scheduled.

---

# **A.13 Design Language Goals**

To emulate Palantir-style UX:

* Dark theme by default.

* High information density.

* Resizable panes.

* Drilldown inspectors.

* Keyboard-first navigation.

* Cross-filtered views.

* Timeline always visible.

* Map, graph, and table interconnected.

Chrona should feel like:

A serious operational system, not a dashboard.

---

# **A.14 v0.1 Core Deliverables**

* Canonical schema \+ source registry

* Ingestion pipeline with 3–5 connectors

* Entity graph

* Feature factory (daily \+ hourly)

* Discovery engine (basic)

* Daily briefing generator

* Hourly delta feed

* Terminal UI

* WorldView-lite map interface

---

This appendix defines the technical foundation required to support:

* Daily intelligence briefings

* Hourly situational updates

* Large public dataset ingestion

* Local-first modeling

* Expansion into broader “world app” capabilities

without overwhelming storage, compute, or token budgets.

## **Appendix B — Scalability & Evolution Roadmap**

### **(Long-Term Architecture Strategy & Upgrade Path)**

This appendix defines how the Chrona tech stack evolves as data volume, modeling complexity, and user expectations increase. It ensures that early architectural decisions remain compatible with long-term scale without premature complexity.

---

# **B.1 Design Philosophy**

Chrona is intentionally staged:

* **v0.1–v0.2:** Infrastructure stabilization

* **v0.3+:** Analytics scaling

* **Later:** Modeling specialization \+ optional service decomposition

The goal is to avoid over-engineering early while preserving upgrade paths.

---

# **B.2 Versioned Infrastructure Evolution**

## **v0.1 – v0.2: Foundational Architecture**

**Primary Stack**

* PostgreSQL (+ optional Timescale extension)

* Redis \+ BullMQ

* MinIO (S3-compatible object storage)

* Node.js (Fastify) backend

* Next.js frontend

* Local LLM via Ollama

* SSE for updates

### **Characteristics**

* Single Postgres instance handles:

  * Events

  * Entities

  * Features

  * Signals

* Discovery jobs run in scheduled batches.

* Feature sets relatively small.

* Daily granularity for signal discovery.

* Hourly updates limited to deltas, not heavy modeling.

### **Why This Works**

* Simplicity.

* Rapid iteration.

* Minimal infra overhead.

* Easy open-source adoption.

---

## **v0.3+: Analytics Scaling Layer**

### **Trigger Conditions**

Move beyond Postgres-only analytics when:

* Feature tables exceed tens of millions of rows.

* Discovery scans become slow (\> seconds for typical scans).

* Backtests require full-history scans across many targets.

* CPU load from aggregation impacts serving latency.

### **Upgrade: Add Columnar Analytics Engine**

**Recommended Addition: ClickHouse**

Why:

* Columnar storage optimized for time-series \+ aggregations.

* Extremely fast large scans.

* Ideal for:

  * Feature discovery

  * Correlation backtests

  * Historical lag sweeps

  * Stability scoring across long windows

### **Architectural Change**

* Postgres remains system-of-record.

* Feature aggregates replicated/exported to ClickHouse.

* Discovery engine queries ClickHouse.

* Signals written back to Postgres for serving.

No core rewrite required.

---

## **v0.4+: Modeling Specialization Layer (Optional)**

### **Trigger Conditions**

* Statistical modeling becomes more complex.

* Feature engineering grows significantly.

* Need for richer backtesting frameworks.

* Desire for faster prototyping of discovery methods.

### **Option A — Stay TypeScript**

* Continue using SQL \+ TS for modeling.

* Keep single-language simplicity.

* Adequate for moderate-scale statistical discovery.

### **Option B — Introduce Python Discovery Service**

* Separate service for modeling only.

* Communicates via API or shared database.

* Python ecosystem advantages:

  * Mature statistical libraries

  * Time-series analysis

  * Better experimental tooling

**Important:**  
 Discovery becomes an isolated service, not embedded in API layer.  
 This keeps the product infrastructure stable.

---

## **Graph Layer (Deferred Decision)**

### **Trigger Conditions**

Introduce dedicated graph DB only if:

* Relationship depth \> 3–4 hops frequently.

* Investigations require complex traversal queries.

* Performance degrades from recursive joins.

* Entity graph grows extremely large.

### **Until Then**

Use Postgres adjacency tables \+ indexed joins.

If needed later:

* Add Neo4j or equivalent.

* Keep Postgres as authoritative store.

* Sync graph DB via event-driven updates.

Do not prematurely add graph DB.

---

# **B.3 Real-Time Evolution**

## **v0.1–v0.2**

* Server-Sent Events (SSE)

* Hourly delta updates

* Scheduled discovery

## **v0.3+**

Move to WebSockets only if:

* Multi-user collaboration is required.

* Investigation workspaces become collaborative.

* Real-time streaming feeds become heavy.

Otherwise SSE remains sufficient.

---

# **B.4 Storage Scaling Strategy**

## **Hot Layer**

* Recent events

* Active signals

* Current features

Optimized via indexing \+ Timescale.

## **Warm Layer**

* Aggregated historical features

* Compressed event tables

* Partitioned by date

## **Cold Layer**

* Raw artifacts

* Parquet exports

* Object storage only

**Upgrade path:**

* Partition Postgres tables by date.

* Archive older partitions to cold storage.

* Rehydrate when needed for recomputation.

---

# **B.5 ML & Inference Evolution**

## **Phase 1**

* Local inference for classification/extraction.

* Statistical discovery (no heavy ML training).

## **Phase 2**

* Small fine-tuned local models for:

  * event classification

  * relevance scoring

  * structured extraction

## **Phase 3**

* Optional custom lightweight models trained on:

  * labeled event-to-move relationships

  * cluster-to-outcome mappings

Important:

* Do not attempt foundation-model training.

* Proprietary value \= ontology \+ features \+ signals, not base LLM.

---

# **B.6 Infrastructure Scaling**

### **Development**

Docker Compose:

* Postgres

* Redis

* MinIO

* Ollama

* API

* Workers

### **Production (Future)**

* Container orchestration

* Horizontal worker scaling

* Separated analytics service (ClickHouse)

* Redis clustering (if required)

* Autoscaling ingestion workers

---

# **B.7 What Stays Stable Long-Term**

These choices are durable:

* Next.js \+ TS frontend

* Postgres as system-of-record

* Object storage for raw artifacts

* Redis for queueing

* Modular connector architecture

* Canonical event schema

* Feature-based discovery design

These will not need replacement if properly abstracted.

---

# **B.8 What Is Designed to Evolve**

* Analytics engine (Postgres → ClickHouse)

* Modeling service (TS → optional Python)

* Real-time transport (SSE → WebSockets)

* Optional graph DB layer

These are additive upgrades, not rewrites.

---

# **B.9 Guiding Rule for All Upgrades**

Never introduce new infrastructure until:

1. A measurable bottleneck exists.

2. The current system is observably constrained.

3. The added complexity clearly outweighs maintenance cost.

Chrona must remain:

* Lean

* Modular

* Observable

* Replaceable in layers

---

# **B.10 Summary**

The long-term scalable open-source path is:

* Start simple.

* Keep infrastructure modular.

* Add analytics specialization when justified.

* Avoid premature distributed complexity.

* Separate serving from modeling.

* Preserve Postgres as authoritative core.

This approach balances:

* Ambition

* Technical rigor

* Cost control

* Open-source integrity

* Long-term scalability


