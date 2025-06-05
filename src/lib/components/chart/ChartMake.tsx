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

export default function ChartMake({ chartData }: Props) {
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

    // create new chart
    chartInstance.current = new Chart(ctx, {
      data: {
        labels: ["2020", "2021", "2022", "2023", "2024"],
        datasets: chartData?.dataSets.map((data) => ({
          type: (data.type || "line") as ChartType,
          data: data.esgDataList.map((item) => parseFloat(item.value)),
          backgroundColor: data.backgroundColor,
          borderColor: data.borderColor,
          borderWidth: parseFloat(data.borderWidth),
          fill: data.fill === "true",
        })),
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [chartData]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
