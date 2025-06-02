export const chartData = {
  environment: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "탄소배출량",
        data: [120, 110, 100, 90, 80],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  },
  social: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "퇴직율",
        data: [12, 14, 13, 11, 10],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "근속연수",
        data: [5.2, 5.5, 5.8, 6.0, 6.3],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "이직율",
        data: [7, 6.5, 6.8, 6.2, 5.9],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  },
  governance: {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "이사회 다양성",
        data: [10, 20, 25, 30, 35],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  },
};
