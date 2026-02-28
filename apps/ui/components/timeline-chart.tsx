"use client";

import ReactECharts from "echarts-for-react";

type TimelinePoint = {
  label: string;
  value: number;
  event?: string;
};

const formatEventLabel = (value?: string) => {
  if (!value) {
    return "";
  }

  return value.length > 20 ? `${value.slice(0, 20)}...` : value;
};

export function TimelineChart({ points }: { points: TimelinePoint[] }) {
  const option = {
    backgroundColor: "transparent",
    grid: {
      top: 20,
      right: 12,
      bottom: 28,
      left: 36
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(7,17,31,0.94)",
      borderColor: "rgba(105,210,177,0.35)",
      textStyle: {
        color: "#edf2ff"
      },
      formatter: (params: Array<{ axisValue: string; data: number }>) => {
        const point = points.find((entry) => entry.label === params[0]?.axisValue);

        if (!point) {
          return "";
        }

        const eventText = point.event
          ? `<br/>Possible catalyst: <strong>${point.event}</strong>`
          : "<br/>Possible catalyst: none attached";

        return `<strong>${point.label}</strong><br/>Latest price snapshot: ${point.value.toFixed(2)}${eventText}`;
      }
    },
    xAxis: {
      type: "category",
      data: points.map((point) => point.label),
      name: "Watchlist ETFs",
      nameLocation: "middle",
      nameGap: 34,
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
        margin: 14,
      }
    },
    yAxis: {
      type: "value",
      name: "Latest price",
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
      }
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: points.map((point) => point.value),
        lineStyle: {
          color: "#69d2b1",
          width: 3
        },
        areaStyle: {
          color: "rgba(105,210,177,0.12)"
        },
        itemStyle: {
          color: "#f2a65a"
        },
        symbolSize: 7,
        markPoint: {
          data: points
            .filter((point) => point.event)
            .map((point) => ({
              name: point.event,
              coord: [point.label, point.value],
              symbol: "circle",
              symbolSize: 28,
              label: {
                color: "#edf2ff",
                formatter: `Possible catalyst\n${formatEventLabel(point.event)}`,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: "rgba(7,17,31,0.92)",
                borderColor: "rgba(105,210,177,0.45)",
                borderWidth: 1,
                borderRadius: 8,
                padding: [6, 8],
                position: "top",
                distance: 10
              },
              itemStyle: {
                color: "#f2a65a"
              }
            }))
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 360, width: "100%" }} />;
}
