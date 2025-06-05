"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  Title,
} from "chart.js";
import { ChartDetail, IChart } from "@/lib/api/interfaces/chart";
import { SiJinja } from "react-icons/si";

// 👇 이렇게 반드시 최상단에서 등록!
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const LineChart2 = ({ chart }: { chart: ChartDetail[] }) => {
  console.log("Chart data:", chart);
  const esgValues =
    chart?.[0]?.dataSets?.[0]?.esgDataList.map((item: { value: string }) =>
      parseFloat(item.value)
    ) ?? [];
  console.log("ESG Values:", esgValues);
  const data = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "ESG Score",

        data: esgValues,
        hoverOffset: 4,
      },
    ],
  };

  return <Line data={data} />;
};

export default LineChart2;
