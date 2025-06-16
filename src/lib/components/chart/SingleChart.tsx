"use client";

import { useEffect, useRef } from "react";
import { ChartDetail } from "@/lib/api/interfaces/chart";
import {
  Chart,
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartType,
  ChartTypeRegistry,
} from "chart.js";
import { Box } from "@chakra-ui/react";

Chart.register(
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface Props {
  chartData: ChartDetail;
}

export default function SingleChart({ chartData }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<keyof ChartTypeRegistry> | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      console.error("❌ Canvas context not available");
      return;
    }

    // destroy old chart if it exists
    chartInstance.current?.destroy();

    console.log("data", chartData);

    const labels = chartData.dataSets.map((data) =>
      data.esgDataList.map((item) => item.year)
    );
    if (chartData.dataSets[0].type === "bar") {
      chartInstance.current = new Chart(ctx, {
        data: {
          labels: labels.flat(),
          datasets: chartData.dataSets.map((data) => ({
            label: data.label,
            type: "bar",
            data: data.esgDataList.map((item) => parseFloat(item.value)),
            backgroundColor: data.backgroundColor,
            borderColor: data.borderColor,
            borderWidth: parseFloat(data.borderWidth),
            fill: data.fill === "true",
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    } else if (chartData.dataSets[0]?.type === "line") {
      chartInstance.current = new Chart(ctx, {
        data: {
          labels: labels.flat(),
          datasets: chartData.dataSets.map((data) => ({
            label: data.label,
            type: "line",
            data: data.esgDataList.map((item) => parseFloat(item.value)),
            backgroundColor: data.backgroundColor,
            borderColor: data.borderColor,
            borderWidth: parseFloat(data.borderWidth),
            fill: data.fill === "true",
          })),
        },
      });
    } else if (chartData.dataSets[0]?.type === "pie") {
      chartInstance.current = new Chart(ctx, {
        data: {
          labels: labels.flat(),
          datasets: chartData.dataSets.map((data) => ({
            label: data.label,
            type: "pie",
            data: data.esgDataList.map((item) => parseFloat(item.value)),
          })),
        },
      });
    } else if (chartData.dataSets[0]?.type === "doughnut") {
      chartInstance.current = new Chart(ctx, {
        data: {
          labels: labels.flat(),
          datasets: chartData.dataSets.map((data) => ({
            label: data.label,
            type: "doughnut",
            data: data.esgDataList.map((item) => parseFloat(item.value)),
          })),
        },
      });

      // create new chart
    }

    return () => {
      chartInstance.current?.destroy();
    };
  }, [chartData]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
