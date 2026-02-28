"use client";

import ReactECharts from "echarts-for-react";

type TimelinePoint = {
  label: string;
  value: number;
  event?: string;
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
      trigger: "axis"
    },
    xAxis: {
      type: "category",
      data: points.map((point) => point.label),
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.25)"
        }
      },
      axisLabel: {
        color: "rgba(237,242,255,0.72)"
      }
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.08)"
        }
      },
      axisLabel: {
        color: "rgba(237,242,255,0.72)"
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
        markPoint: {
          data: points
            .filter((point) => point.event)
            .map((point) => ({
              name: point.event,
              coord: [point.label, point.value],
              label: {
                color: "#07111f",
                formatter: point.event
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
