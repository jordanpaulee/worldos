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

const getBarColor = (movePct: number) => {
  if (movePct > 0) {
    return "#69d2b1";
  }

  if (movePct < 0) {
    return "#f28f79";
  }

  return "#94a3b8";
};

const getBarBorderRadius = (movePct: number) => {
  if (movePct > 0) {
    return [12, 12, 0, 0];
  }

  if (movePct < 0) {
    return [0, 0, 12, 12];
  }

  return [12, 12, 12, 12];
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

const TOOLTIP_MAX_WIDTH = 360;

export function TimelineChart({ points }: { points: ImpactPreviewPoint[] }) {
  const labeledPoints = points.filter((point) => point.eventTitle);
  const values = points.map((point) => point.movePct);
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  const maxAbs = Math.max(Math.abs(minValue), Math.abs(maxValue), 0.01);
  const axisPad = Math.max(0.15, maxAbs * 0.25);
  const fmtPct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`;

  const buildTooltip = (point: ImpactPreviewPoint, catalystNumber: number) => {
    const moveColor = point.movePct >= 0 ? "#86efac" : "#fca5a5";
    const statusColor = getStatusColor(point.status);
    const eventSection = point.eventTitle
      ? `
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(148,163,184,0.16);">
          <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(226,232,240,0.62);">
            Possible Catalyst ${catalystNumber}
          </div>
          <div style="margin-top:5px;font-size:15px;font-weight:700;color:#f8fafc;line-height:1.25;">
            ${point.eventTitle}
          </div>
        </div>
      `
      : "";

    return `
      <div style="width:min(${TOOLTIP_MAX_WIDTH}px, calc(100vw - 32px));max-width:${TOOLTIP_MAX_WIDTH}px;box-sizing:border-box;white-space:normal;word-break:break-word;overflow-wrap:anywhere;padding:2px 2px 0;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
          <div>
            <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(226,232,240,0.62);">
              ${point.symbol}
            </div>
            <div style="margin-top:4px;font-size:20px;font-weight:700;color:${moveColor};">
              ${point.movePct >= 0 ? "+" : ""}${point.movePct.toFixed(2)}%
            </div>
          </div>
          <div style="flex-shrink:0;padding:6px 10px;border:1px solid ${statusColor}33;background:${statusColor}26;border-radius:999px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#f8fafc;">
            ${point.status}
          </div>
        </div>

        <div style="width:100%;margin-top:10px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;">
          <div style="padding:8px;border-radius:12px;background:rgba(15,23,42,0.66);border:1px solid rgba(148,163,184,0.12);">
            <div style="font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(226,232,240,0.56);">Price</div>
            <div style="margin-top:4px;font-size:13px;font-weight:600;color:#f8fafc;">${point.latestPrice.toFixed(2)}</div>
          </div>
          <div style="padding:8px;border-radius:12px;background:rgba(15,23,42,0.66);border:1px solid rgba(148,163,184,0.12);">
            <div style="font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(226,232,240,0.56);">Relevance</div>
            <div style="margin-top:4px;font-size:13px;font-weight:600;color:#f8fafc;">${Math.round(point.relevanceScore * 100)}%</div>
          </div>
          <div style="padding:8px;border-radius:12px;background:rgba(15,23,42,0.66);border:1px solid rgba(148,163,184,0.12);">
            <div style="font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(226,232,240,0.56);">Confidence</div>
            <div style="margin-top:4px;font-size:13px;font-weight:600;color:#f8fafc;">${Math.round(point.confidenceScore * 100)}%</div>
          </div>
        </div>

        ${eventSection}

        <div style="margin-top:10px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(226,232,240,0.56);">
          Why it matters
        </div>
        <div style="margin-top:5px;font-size:12px;line-height:1.5;color:rgba(241,245,249,0.92);">
          ${point.narrative}
        </div>

        <div style="margin-top:10px;font-size:11px;color:rgba(226,232,240,0.68);">
          Expected horizon: <span style="color:#f8fafc;">${point.horizon}</span>
        </div>
      </div>
    `;
  };

  const option = {
    backgroundColor: "transparent",
    grid: {
      left: 36,
      right: 48,
      top: 44,
      bottom: 36,
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      renderMode: "html",
      confine: true,
      appendToBody: false,
      enterable: false,
      padding: 10,
      backgroundColor: "rgba(3,10,20,0.985)",
      borderColor: "rgba(105,210,177,0.35)",
      className: "worldos-echart-tooltip",
      extraCssText: `
        max-width: 420px;
        white-space: normal;
        word-break: break-word;
        overflow-wrap: anywhere;
        pointer-events: none;
        border-radius: 16px;
      `,
      textStyle: {
        color: "#edf2ff"
      },
      position: (
        point: number[],
        _params: unknown,
        _dom: unknown,
        _rect: unknown,
        size: { contentSize: number[]; viewSize: number[] },
      ) => {
        const PADDING = 16;
        const OFFSET = 14;
        const KEEP_OUT = 32;

        const chartWidth = size.viewSize[0];
        const chartHeight = size.viewSize[1];
        const tooltipWidth = size.contentSize[0];
        const tooltipHeight = size.contentSize[1];

        const x = point[0];
        const y = point[1];

        let finalX: number;
        let finalY: number;

        const rightThreshold = chartWidth * 0.65;
        const leftThreshold = chartWidth * 0.35;

        if (x > rightThreshold) {
          finalX = x - tooltipWidth - OFFSET;
        } else if (x < leftThreshold) {
          finalX = x + OFFSET;
        } else {
          finalX = x - tooltipWidth / 2;
        }

        if (y - tooltipHeight - OFFSET > PADDING) {
          finalY = y - tooltipHeight - OFFSET;
        } else {
          finalY = y + OFFSET;
        }

        finalX = Math.max(PADDING, Math.min(finalX, chartWidth - tooltipWidth - PADDING - KEEP_OUT));
        finalY = Math.max(PADDING, Math.min(finalY, chartHeight - tooltipHeight - PADDING));

        return [finalX, finalY];
      },
      formatter: (params: { name: string }) => {
        const point = points.find((entry) => entry.symbol === params.name);
        const catalystNumber = labeledPoints.findIndex((entry) => entry.symbol === params.name) + 1;

        if (!point) {
          return "";
        }

        return buildTooltip(point, catalystNumber);
      }
    },
    xAxis: {
      type: "category",
      data: points.map((point) => point.symbol),
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
      min: -maxAbs - axisPad,
      max: maxAbs + axisPad,
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.08)"
        }
      },
      axisLabel: {
        show: false,
      }
    },
    series: [
      {
        type: "bar",
        name: "Observed move",
        barWidth: 44,
        label: {
          show: false,
        },
        labelLayout: {
          hideOverlap: true,
          moveOverlap: "shiftY",
        },
        data: points.map((point) => ({
          name: point.symbol,
          value: point.movePct,
          itemStyle: {
            color: getBarColor(point.movePct),
            borderRadius: getBarBorderRadius(point.movePct),
          },
          label: {
            show: true,
            position: point.movePct >= 0 ? "top" : "bottom",
            formatter: fmtPct(point.movePct),
            distance: 16,
            color: "#edf2ff",
            fontSize: 11,
            fontWeight: 700,
          },
        })),
      },
      {
        type: "scatter",
        name: "Possible catalyst",
        label: {
          show: false,
        },
        data: points.map((point) => ({
          name: point.symbol,
          value: [point.symbol, point.movePct],
          symbolSize: point.eventTitle ? 18 : 0,
          itemStyle: {
            color: getStatusColor(point.status),
          },
        })),
        z: 3,
      },
      {
        type: "line",
        name: "Zero",
        label: {
          show: false,
        },
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

  return (
    <div className="relative">
      <ReactECharts option={option} style={{ height: 360, width: "100%" }} />
    </div>
  );
}
