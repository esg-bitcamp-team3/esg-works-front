"use client";

import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LineChart2 from "./lineChart2";
import { ChartDetail, IChart } from "@/lib/api/interfaces/chart";
import { getChart } from "@/lib/api/get";

export default function Page() {
  const [chart, setChart] = useState<ChartDetail[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      try {
        const data = await getChart();
        if (data) {
          console.log("Fetched chart data:", data);
          const filteredData = data.filter(
            (item) => item.chartId === "683d581b2538e6624c5c3790"
          );
          console.log("Filtered chart data:", filteredData);
          setChart(filteredData);
        } else {
          setError("차트 데이터를 불러올 수 없습니다.");
        }
      } catch (err) {
        setError("차트 데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, []);
  if (!chart) {
    return <div>Loading chart data...</div>;
  }
  return <LineChart2 chart={chart} />;
}
