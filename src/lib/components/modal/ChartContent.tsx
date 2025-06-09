import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Chart } from "react-chartjs-2";

import { useEffect, useState } from "react";

import {
  FcBarChart,
  FcComboChart,
  FcDoughnutChart,
  FcLineChart,
  FcPieChart,
} from "react-icons/fc";

import { getEsgData } from "@/lib/api/get";
import {
  ChartContentProps,
  DatasetType,
  DataType,
} from "@/lib/api/interfaces/chart";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";

// Add this import at the top with other imports
import { ChartOptions } from "chart.js";
import ChartColor from "./chartColor";

// Chart.js에 사용될 기본 옵션 설정 (축, 범례 위치 등)
const chartOptions: ChartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    // title: {
    //   display: true,
    //   text: "데이터 시각화",
    // },
  },
};

// ESG 데이터를 받아와 차트를 렌더링하는 ChartContent 컴포넌트
const ChartContent = ({ categoryId, selected, charts }: ChartContentProps) => {
  const [chartData, setChartData] = useState<DataType>();
  const [categorizedEsgDataList, setCategorizedEsgDataList] = useState<
    CategorizedESGDataList[]
  >([]);
  const [selectedChartType, setSelectedChartType] =
    useState<DatasetType["type"]>("bar");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  // const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);

  // categoryId가 바뀔 때마다 각 ID에 해당하는 ESG 데이터를 불러오고 상태로 저장
  useEffect(() => {
    if (categorizedEsgDataList.length > 0 && selectedYear) {
      const datasets = categorizedEsgDataList.map((category, idx) => {
        const color =
          selectedColors[idx] ||
          `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        // 선택된 연도 데이터만 추출
        const yearData = category.esgNumberDTOList.find(
          (data) => data.year === selectedYear
        );
        return {
          type: selectedChartType,
          label: category.categoryDetailDTO.categoryName,
          data: [yearData ? yearData.value : 0], // 파이 차트는 여러 카테고리의 한 해 데이터로 구성됨
          borderColor: selectedChartType === "line" ? color : undefined,
          backgroundColor:
            selectedChartType === "line" ? "rgba(255, 255, 255, 0.1)" : color,
          fill: true,
        };
      });

      setChartData({
        labels: categorizedEsgDataList.map(
          (category) => category.categoryDetailDTO.categoryName
        ),
        datasets: datasets,
      });
    }
  }, [categorizedEsgDataList, selectedChartType, selectedColors, selectedYear]);

  // 불러온 ESG 데이터를 연도별로 정리하고 차트에 들어갈 datasets 형식으로 변환
  useEffect(() => {
    if (categorizedEsgDataList.length > 0) {
      const extractedYears = Array.from(
        new Set(
          categorizedEsgDataList.flatMap((category) =>
            category.esgNumberDTOList.map((data) => data.year)
          )
        )
      ).sort();
      setYears(extractedYears);


      const datasets = categorizedEsgDataList.map((category, idx) => {
        // 선택된 색상이 있다면 사용하고, 없다면 무작위 색상 생성
        const color =
          selectedColors[idx] ||
          `#${Math.floor(Math.random() * 16777215).toString(16)}`;

        return {
          type: selectedChartType,
          label: category.categoryDetailDTO.categoryName,
          data: years.map((year) => {
            const yearData = category.esgNumberDTOList.find(
              (data) => data.year === year
            );
            return yearData ? yearData.value : 0;
          }),
          borderColor: selectedChartType === "line" ? color : undefined,
          backgroundColor:
            selectedChartType === "line" ? "rgba(255, 255, 255, 0.1)" : color,
          fill: true,
        };
      });

      setChartData({
        labels: years.map((year) => year.toString()),
        datasets: datasets,
      });
    }
  }, [categorizedEsgDataList, selectedChartType, selectedColors]);

  // 배경색 커스터마이징을 위한 옵션 확장
  const localChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      custom_canvas_background_color: {
        color: backgroundColor,
      },
    },
  };

  return (
    <Flex
      direction={{ base: "column", md: "column" }}
      justifyContent={{ base: "center", md: "space-between" }}
      alignItems={{ base: "flex-start", md: "center" }}
      minHeight={{ base: "45vh", md: "35vh", lg: "30vh" }}
      maxHeight={{ base: "50vh", md: "40vh", lg: "80vh" }}
      overflowY="auto"
      width="100%"
      gap="4"
      p="1"
    >
      <Stack direction="row" align="auto" width="100%" borderRadius="md">
        {/* 차트 유형 버튼들 */}
        {[
          { type: "bar", icon: FcBarChart },
          { type: "line", icon: FcLineChart },
          { type: "pie", icon: FcPieChart },
          { type: "doughnut", icon: FcDoughnutChart },
          { type: "mixed", icon: FcComboChart },
        ].map(({ type, icon }) => (
          <Button
            key={type}
            onClick={() =>
              setSelectedChartType(type as typeof selectedChartType)
            }
            variant={selectedChartType === type ? "solid" : "outline"}
            colorScheme="blue"
            textAlign="left"
            justifyContent="flex-start"
            p={3}
            bg={selectedChartType === type ? "blue.500" : "transparent"}
            color={selectedChartType === type ? "white" : "inherit"}
          >
            <Icon as={icon} mr={2} /> {type.toUpperCase()}
          </Button>
        ))}
        {/* 연도 선택 Select */}
        <Box ml={4}>
          <Text fontSize="sm" fontWeight="bold">
            연도 선택
          </Text>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            <option value="">연도 선택</option>
            {years.map((year: string) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
        </Box>
      </Stack>
      {/* 차트 및 차트 색상 커스텀 */}
      <Stack direction="row" width="100%" gap="4">
        <VStack
          align={{ base: "flex-start", md: "center", lg: "flex-start" }}
          minHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
          maxHeight={{ base: "30vh", md: "45vh", lg: "50vh" }}
          flex="3"
          width="100%"
          textAlign={{ base: "left", md: "center" }}
          outline={"1px solid #E2E8F0"}
          padding={3}
          overflow="hidden"
        >
          {!chartData || !chartData.labels || !chartData.datasets ? (
            <Text fontSize="sm" color="gray.500">
              차트를 불러올 수 없습니다.
            </Text>
          ) : (
            // 차트를 화면에 렌더링
            <Box
              width="100%"
              mt={4}
              overflow="hidden"
              justifyContent="center"
              justifyItems="center"
            >
              <Chart
                type={selectedChartType}
                data={chartData}
                options={chartOptions}
              />
            </Box>
          )}
        </VStack>
        <Box flex="1" outline={"1px solid #E2E8F0"}>
          {/* <Text fontSize="lg" fontWeight="bold" color="#2F6EEA">
            선택된 지표:
          </Text> */}
          {/* 색상과 배경색 설정을 위한 사용자 정의 컴포넌트 */}
          <ChartColor
            categorizedEsgDataList={categorizedEsgDataList}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
          />
        </Box>
      </Stack>
    </Flex>
  );
};

export default ChartContent;
