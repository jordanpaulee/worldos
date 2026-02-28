"use client";

import ReactECharts from "echarts-for-react";

type ImpactPreviewPoint = {
  symbol: string;
  movePct: number;
  latestPrice: number;
  eventTitle?: string;
  narrative: string;
  relevanceScore: number;
  confidenceScore: number;
  horizon: string;
  status: "watching" | "active" | "cooling";
};

const formatEventLabel = (value?: string) => {
  if (!value) {
    return "";
  }

  return value.length > 16 ? `${value.slice(0, 16)}...` : value;
};

const getBarColor = (movePct: number) => {
  if (movePct > 0) {
    return "#69d2b1";
  }

  if (movePct < 0) {
    return "#f28f79";
  }

  return "#94a3b8";
};

const getStatusColor = (status: ImpactPreviewPoint["status"]) => {
  if (status === "active") {
    return "#f2a65a";
  }

  if (status === "watching") {
    return "#69d2b1";
  }

  return "#94a3b8";
};

export function TimelineChart({ points }: { points: ImpactPreviewPoint[] }) {
  const option = {
    backgroundColor: "transparent",
    grid: {
      top: 42,
      right: 12,
      bottom: 42,
      left: 48,
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(7,17,31,0.94)",
      borderColor: "rgba(105,210,177,0.35)",
      textStyle: {
        color: "#edf2ff"
      },
      formatter: (params: { name: string }) => {
        const point = points.find((entry) => entry.symbol === params.name);

        if (!point) {
          return "";
        }

        const eventText = point.eventTitle
          ? `<br/>Possible catalyst: <strong>${point.eventTitle}</strong>`
          : "<br/>Possible catalyst: none attached";

        return [
          `<strong>${point.symbol}</strong>`,
          `Observed move: ${point.movePct >= 0 ? "+" : ""}${point.movePct.toFixed(2)}%`,
          `Latest price: ${point.latestPrice.toFixed(2)}`,
          `Relevance score: ${Math.round(point.relevanceScore * 100)}%`,
          `Confidence: ${Math.round(point.confidenceScore * 100)}%`,
          `Horizon: ${point.horizon}`,
          eventText,
          `<br/>${point.narrative}`,
        ].join("<br/>");
      }
    },
    xAxis: {
      type: "category",
      data: points.map((point) => point.symbol),
      name: "Watchlist targets",
      nameLocation: "middle",
      nameGap: 32,
      nameTextStyle: {
        color: "rgba(237,242,255,0.72)",
        fontSize: 11
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.25)"
        }
      },
      axisLabel: {
        color: "rgba(237,242,255,0.82)",
        fontSize: 12,
        margin: 14
      }
    },
    yAxis: {
      type: "value",
      name: "Observed move (%)",
      nameTextStyle: {
        color: "rgba(237,242,255,0.72)",
        fontSize: 11,
        padding: [0, 0, 8, 0]
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.08)"
        }
      },
      axisLabel: {
        color: "rgba(237,242,255,0.82)",
        fontSize: 12,
        margin: 10,
        formatter: (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
      }
    },
    series: [
      {
        type: "bar",
        name: "Observed move",
        barWidth: 44,
        data: points.map((point) => ({
          name: point.symbol,
          value: point.movePct,
          itemStyle: {
            color: getBarColor(point.movePct),
            borderRadius: [12, 12, 0, 0],
          },
          label: {
            show: true,
            position: point.movePct >= 0 ? "top" : "bottom",
            distance: 10,
            color: "#edf2ff",
            fontSize: 11,
            fontWeight: 700,
            formatter: `${point.movePct >= 0 ? "+" : ""}${point.movePct.toFixed(2)}%`,
          },
        })),
      },
      {
        type: "scatter",
        name: "Possible catalyst",
        data: points.map((point) => ({
          name: point.symbol,
          value: [point.symbol, point.movePct],
          symbolSize: point.eventTitle ? 18 : 0,
          itemStyle: {
            color: getStatusColor(point.status),
          },
          label: point.eventTitle
            ? {
                show: true,
                formatter: `Possible catalyst\n${formatEventLabel(point.eventTitle)}`,
                position: point.movePct >= 0 ? "top" : "bottom",
                distance: 28,
                color: "#edf2ff",
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: "rgba(7,17,31,0.92)",
                borderColor: "rgba(105,210,177,0.35)",
                borderWidth: 1,
                borderRadius: 8,
                padding: [6, 8],
              }
            : {
                show: false,
              },
        })),
        z: 3,
      },
      {
        type: "line",
        name: "Zero",
        data: points.map(() => 0),
        lineStyle: {
          color: "rgba(255,255,255,0.16)",
          width: 1,
          type: "dashed",
        },
        itemStyle: {
          color: "transparent",
        },
        symbol: "none",
        z: 1,
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 360, width: "100%" }} />;
}
