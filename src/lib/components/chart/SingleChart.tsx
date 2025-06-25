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
  ArcElement, // Add ArcElement for pie/doughnut charts
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box } from "@chakra-ui/react";
import { Chart } from "react-chartjs-2";
import { ESGData } from "@/lib/api/interfaces/esgData";

ChartJS.register(
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

interface Props {
  chartData: ChartDetail;
}

type ChartTypeUnion = "bar" | "line" | "pie" | "doughnut" | "mixed";

export default function SingleChart({ chartData }: Props) {
  const [data, setData] = useState<ChartData>();
  const [chartType, setChartType] = useState<ChartTypeUnion>();

  // Parse options safely with a fallback
  const parsedOptions = chartData.options ? JSON.parse(chartData.options) : {};

  // Create options with formatter
  const options = {
    ...parsedOptions,
    plugins: {
      ...parsedOptions.plugins,
      datalabels: {
        ...parsedOptions.plugins?.datalabels,
        formatter: (value: number, context: any) => {
          const datalabelsOptions = parsedOptions.plugins?.datalabels || {};

          // Extract format options from the parsed options
          const format = datalabelsOptions.format || "number";
          const prefix = datalabelsOptions.prefix || "";
          const postfix = datalabelsOptions.postfix || "";
          const decimals = datalabelsOptions.decimals || 2;
          const digits = datalabelsOptions.digits || 0;

          let formattedValue: string | number = value;

          // 숫자 단위 적용
          let divider = 1;
          let unitSuffix = "";

          switch (digits) {
            case 1: // 천 단위
              divider = 1000;
              unitSuffix = "K";
              break;
            case 2: // 백만 단위
              divider = 1000000;
              unitSuffix = "M";
              break;
            case 3: // 십억 단위
              divider = 1000000000;
              unitSuffix = "B";
              break;
          }

          // 단위 변환 적용
          if (divider > 1) {
            formattedValue = value / divider;
          }

          // 포맷 적용
          switch (format) {
            case "percent":
              const total = context.dataset.data.reduce(
                (sum: number, val: number) => sum + val,
                0
              );
              formattedValue = ((value / total) * 100).toFixed(decimals);
              if (!postfix && unitSuffix === "") {
                unitSuffix = "%";
              }
              break;
            case "currency":
              formattedValue = new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              }).format(formattedValue as number);
              // 이미 통화 형식에 포함된 경우 단위 접미사는 추가하지 않음
              unitSuffix = "";
              break;
            case "number":
              formattedValue = new Intl.NumberFormat("ko-KR", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              }).format(formattedValue as number);
              break;
            default:
              formattedValue = (formattedValue as number).toFixed(decimals);
          }

          return `${prefix}${formattedValue}${unitSuffix}${postfix}`;
        },
      },
    },
  };

  useEffect(() => {
    setChartType(chartData.type as ChartTypeUnion);

    const newChartData = {
      labels: chartData.labels,
      datasets: chartData.dataSets.map((dataset) => {
        // Get properties from chartProperties object if it exists
        const properties = dataset.chartProperties || {};

        // Create base dataset with required properties
        const chartDataset: any = {
          label: properties.label || dataset.label,
          data: dataset.esgDataList.map((item: ESGData) =>
            parseFloat(item.value)
          ),
        };

        // Only add backgroundColor if it exists
        if (properties.backgroundColor) {
          chartDataset.backgroundColor = Array.isArray(
            properties.backgroundColor
          )
            ? properties.backgroundColor
            : [properties.backgroundColor];
        }

        // Only add borderColor if it exists
        if (properties.borderColor) {
          chartDataset.borderColor = Array.isArray(properties.borderColor)
            ? properties.borderColor
            : [properties.borderColor];
        }

        // Add other properties only if they exist and have values
        if (properties.borderWidth) {
          chartDataset.borderWidth = parseFloat(properties.borderWidth);
        }

        if (properties.fill === "true") {
          chartDataset.fill = true;
        } else if (properties.fill === "false") {
          chartDataset.fill = false;
        }

        // Add line chart specific properties only if they exist
        if (properties.tension) {
          chartDataset.tension = parseFloat(properties.tension);
        }

        if (properties.pointBackgroundColor) {
          chartDataset.pointBackgroundColor = properties.pointBackgroundColor;
        }

        if (properties.pointBorderColor) {
          chartDataset.pointBorderColor = properties.pointBorderColor;
        }

        if (properties.pointHoverBackgroundColor) {
          chartDataset.pointHoverBackgroundColor =
            properties.pointHoverBackgroundColor;
        }

        if (properties.pointHoverBorderColor) {
          chartDataset.pointHoverBorderColor = properties.pointHoverBorderColor;
        }

        if (properties.pointRadius) {
          chartDataset.pointRadius = parseFloat(properties.pointRadius);
        }

        if (properties.pointHoverRadius) {
          chartDataset.pointHoverRadius = parseFloat(
            properties.pointHoverRadius
          );
        }

        if (properties.pointStyle) {
          chartDataset.pointStyle = properties.pointStyle;
        }

        // Pie/Doughnut specific fields
        if (properties.hoverOffset) {
          chartDataset.hoverOffset = parseFloat(properties.hoverOffset);
        }

        if (properties.offset) {
          chartDataset.offset = parseFloat(properties.offset);
        }

        if (properties.circumference) {
          chartDataset.circumference = parseFloat(properties.circumference);
        }

        if (properties.rotation) {
          chartDataset.rotation = parseFloat(properties.rotation);
        }

        if (properties.cutout) {
          chartDataset.cutout = properties.cutout;
        }

        if (properties.weight) {
          chartDataset.weight = parseFloat(properties.weight);
        }

        return chartDataset;
      }),
    };

    setData(newChartData);
  }, [chartData]);

  return (
    <Box height="200px" width="100%">
      {data && chartType && (
        <Chart
          type={chartType === "mixed" ? "bar" : chartType}
          data={data}
          options={options}
        />
      )}
    </Box>
  );
}
