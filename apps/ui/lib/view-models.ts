import { getMacroCalendarConnector, getPricesConnector } from "@worldos/connectors";

export const buildDashboardViewModel = async () => {
  const pricesConnector = getPricesConnector();
  const macroConnector = getMacroCalendarConnector();
  const [instruments, events] = await Promise.all([pricesConnector.fetch(), macroConnector.fetch()]);

  return {
    instruments,
    events,
    timeline: instruments.slice(0, 8).map((instrument, index) => ({
      label: instrument.symbol,
      value: instrument.latestPrice,
      event: events[index]?.title
    }))
  };
};

export const buildDailyViewModel = async () => {
  const pricesConnector = getPricesConnector();
  const macroConnector = getMacroCalendarConnector();
  const [instruments, events] = await Promise.all([pricesConnector.fetch(), macroConnector.fetch()]);

  return {
    lead: "Fixture-driven view of key ETFs and macro events for the minimal public-world alpha.",
    marketSnapshot: instruments.slice(0, 3),
    eventHighlights: events.slice(0, 4)
  };
};
