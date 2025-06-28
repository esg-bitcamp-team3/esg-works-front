// "use client";

// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// // 👇 이렇게 반드시 최상단에서 등록!
// ChartJS.register(ArcElement, Tooltip, Legend);

// const CircleChart = () => {
//   const data = {
//     labels: ["Red", "Blue", "Yellow"],
//     datasets: [
//       {
//         label: "My First Dataset",
//         data: [300, 50, 100],
//         backgroundColor: [
//           "rgb(255, 99, 132)",
//           "rgb(54, 162, 235)",
//           "rgb(255, 205, 86)",
//         ],
//         hoverOffset: 4,
//       },
//     ],
//   };

//   return <Pie data={data} />;
// };

// export default CircleChart;

"use client";

import TableChart from "./TableChart";
import SingleChart from "./SingleChart";
import MixedChart from "./MixedChart";

interface ChartProps {
  chartData: any; // Replace 'any' with a more specific type if available
}

export default function Chart({ chartData }: ChartProps) {
  // 차트 타입을 options에서 추출
  let chartType = "bar";
  try {
    // chartData.options는 string일 가능성이 높으므로 JSON.parse 필요
    chartType = JSON.parse(chartData.options)?.type ?? "bar";
  } catch {
    // 만약 파싱 안되면 기본값 bar
    chartType = "bar";
  }

  // 타입별로 컴포넌트 분기
  if (chartType === "table") {
    return <TableChart chartData={chartData} />;
  }
  if (chartType === "mixed") {
    return <MixedChart chartData={chartData} />;
  }
  // pie, doughnut, bar, line 등은 SingleChart에서 처리
  return <SingleChart chartData={chartData} />;
}
