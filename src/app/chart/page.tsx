"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { ChartDetail } from "@/lib/api/interfaces/chart";
import { getChart, getChartByType } from "@/lib/api/get";
import ChartMake from "@/lib/components/chart/ChartMake";

export default function Page() {
  const [chart, setChart] = useState<ChartDetail[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      try {
        const data = await getChartByType("bar");
        if (data && data.length > 0) {
          console.log("Fetched chart data:", data);
          setChart(data);
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

  return (
    <Box mt={6} flex="1" overflowY="auto">
      <Flex flexDirection="column" gap={4}>
        <Box p={4}>
          <ChartMake chartData={chart?.[0] || null} />
        </Box>
      </Flex>
    </Box>
  );
}
