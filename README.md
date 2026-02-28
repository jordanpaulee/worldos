![Project Chrona logo](assets/logo-1.png)

# Project Chrona

AI-native macro intelligence terminal.

Chrona is a time-aware market intelligence system that ingests public macro, financial, and event-driven signals and produces structured, scored insights for daily and intraday awareness.

![Project Chrona dashboard overview](assets/chrona-dashboard-1.png)

![Project Chrona dashboard detail](assets/chrona-dashboard-2.png)

## Positioning

Chrona is not:
- a trading bot
- a scraping toy
- a feed aggregator

Chrona is:
- a temporal signal engine
- a structured catalyst model
- a briefing generator
- a correlation memory system

## Current Functionality

The current repo is an architecture-first alpha focused on:
- ingesting fixture-backed macro calendar and market price data
- normalizing events, instruments, impacts, features, and signals through shared schemas
- exposing API routes for health, events, instruments, and briefing data
- rendering a UI for watchlist impact preview, recent events, and signal scaffolding
- supporting background worker infrastructure for ingestion-oriented flows

Today, Chrona is a structured macro intelligence prototype, not a finished forecasting system.

## Architecture

The current repository is organized as a small monorepo:
- `apps/api`: Fastify API for health, events, instruments, and briefing endpoints
- `apps/ui`: Next.js interface for dashboard, watchlist impact preview, and briefing views
- `apps/workers`: background ingestion and processing workers
- `packages/core-schema`: shared schemas and domain types
- `packages/connectors`: source connectors for macro calendar and price inputs
- `packages/source-registry`: source registry definitions
- `packages/db`: database defaults and migration references

## System Framing

Chrona ingests public signals, normalizes them into structured event and market objects, computes reusable features, and assembles scored views that can be used for:
- daily briefings
- intraday change detection
- catalyst-to-watchlist mapping
- persistent context across events, instruments, and prior signal behavior

The intent is operational awareness and structured reasoning around macro and market context, not automated execution.

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- ECharts

**Backend**
- Node.js
- Fastify
- TypeScript

**Workers**
- BullMQ
- Redis

**Data / Schema**
- PostgreSQL-oriented local infra
- Shared typed schemas with Zod
- Structured event, instrument, impact, feature, and signal models

**Tooling**
- pnpm workspaces
- Turborepo
- Docker Compose

## Intended Direction

Chrona is being built toward:
- daily macro and market briefings
- intraday awareness updates
- structured catalyst scoring
- persistent memory across events, instruments, and signals
- better operator visibility into why something may matter before attempting to forecast what happens next

That direction is intentional, but the current codebase is still early and uses local fixture data in key places.

## Status

Active development.

Current state:
- architecture-first monorepo
- fixture-backed connectors
- API, UI, and worker scaffolding in place
- signal and impact views implemented as alpha product shape
- forecasting and model-driven ranking not yet production-real

## Development

Workspace tooling:
- package manager: `pnpm`
- task runner: `turbo`

Common commands:

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
pnpm dev
```

## Notes

This is a personal systems and product build focused on macro intelligence infrastructure, structured market context, and explainable signal generation.
