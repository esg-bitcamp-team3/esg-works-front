"use client";

import { useEffect, useState } from "react";
import { ChartDetail } from "@/lib/api/interfaces/chart";
import {
  Chart as ChartJS,
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

import { Box } from "@chakra-ui/react";
import { Chart } from "react-chartjs-2";

ChartJS.register(
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

type ChartTypeUnion = "bar" | "line" | "pie" | "doughnut";

export default function SingleChart({ chartData }: Props) {
  const [chartWithOptions, setChartWithOptions] = useState<
    ChartData<ChartTypeUnion, number[], string>
  >({
    labels: [],
    datasets: [],
  });

  const options = JSON.parse(chartData.options);

  useEffect(() => {
    const years = Array.from(
      new Set(
        chartData.dataSets.flatMap((dataSet) =>
          dataSet.esgDataList.map((data) => data.year)
        )
      )
    ).sort();

    let newChartData: ChartData<ChartTypeUnion, number[], string> | undefined;

    const chartType = chartData.dataSets[0]?.type;

    if (chartType === "bar" || chartType === "line") {
      newChartData = {
        labels: years.map((year) => year.toString()),
        datasets: chartData.dataSets.map((dataSet) => ({
          type: dataSet.type as "bar" | "line",
          label: dataSet.label,
          data: years.map((year) => {
            const yearData = dataSet.esgDataList.find(
              (data) => data.year === year
            );
            return yearData ? parseFloat(yearData.value) || 0 : 0;
          }),
          borderColor: dataSet.borderColor,
          backgroundColor: dataSet.backgroundColor,
          borderWidth: Number(dataSet.borderWidth),
          fill: dataSet.fill === "true" || dataSet.fill === "1",
        })),
      };
    } else if (chartType === "pie" || chartType === "doughnut") {
      const dataSet = chartData.dataSets[0];
      newChartData = {
        labels: dataSet.esgDataList.map((data) => data.year),
        datasets: [
          {
            type: dataSet.type as "pie" | "doughnut",
            label: dataSet.label,
            data: dataSet.esgDataList.map(
              (data) => parseFloat(data.value) || 0
            ),
            backgroundColor: Array.isArray(dataSet.backgroundColor)
              ? dataSet.backgroundColor
              : [dataSet.backgroundColor],
            borderColor: Array.isArray(dataSet.borderColor)
              ? dataSet.borderColor
              : [dataSet.borderColor],
            borderWidth: Number(dataSet.borderWidth),
            hoverOffset: 10,
          },
        ],
      };
    }

    if (newChartData) {
      setChartWithOptions(newChartData);
    }
  }, [chartData]);

  return (
    <Box>
      <Chart
        type={chartData.dataSets[0].type as ChartTypeUnion}
        data={chartWithOptions}
        options={options}
      />
    </Box>
  );
}
