# Project Chrona

AI-native macro intelligence terminal.

Chrona is a time-aware market intelligence system that ingests public macro, financial, and event-driven signals and produces structured, scored insights for daily and intraday awareness.

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
