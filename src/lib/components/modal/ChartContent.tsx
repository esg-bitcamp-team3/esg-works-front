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

// Inside the ChartContent component, add this options configuration
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

const ChartContent = ({ categoryId, selected, charts }: ChartContentProps) => {
  const [chartData, setChartData] = useState<DataType>();
  const [categorizedEsgDataList, setCategorizedEsgDataList] = useState<
    CategorizedESGDataList[]
  >([]);
  const [selectedChartType, setSelectedChartType] =
    useState<DatasetType["type"]>("bar");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    Promise.all(categoryId.map((id) => getEsgData(id)))
      .then((results) => {
        const validResults = results.filter(
          (result): result is CategorizedESGDataList => result !== null
        );
        setCategorizedEsgDataList(validResults);
      })
      .catch((error) => {
        console.error("Error fetching ESG data:", error);
      });
  }, [categoryId, selected]);

  useEffect(() => {
    if (categorizedEsgDataList.length > 0) {
      const years = Array.from(
        new Set(
          categorizedEsgDataList.flatMap((category) =>
            category.esgNumberDTOList.map((data) => data.year)
          )
        )
      ).sort();

      const datasets = categorizedEsgDataList.map((category, idx) => {
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
      gap={4}
      p="1"
    >
      <Stack
        direction="row"
        align="auto"
        width="100%"
        // maxHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
        padding={3}
        borderRadius="md"
        // outline={"1px solid #E2E8F0"}
        // justifyContent='end'
      >
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
            variant="outline"
            colorScheme="blue"
            // width="full"
            textAlign="left"
            justifyContent="flex-start"
            p={3}
          >
            <Icon as={icon} /> 
          </Button>
        ))}
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
        <Box flex="2" outline={"1px solid #E2E8F0"}>
          {/* <Text fontSize="lg" fontWeight="bold" color="#2F6EEA">
            선택된 지표:
          </Text> */}
          {/* 색상과 배경색 설정을 위한 사용자 정의 컴포넌트 */}
          {/* <Flex gap='2' w='100%'>
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
            variant="outline"
            colorScheme="blue"
            // width="full"
            textAlign="left"
            justifyContent="flex-start"
            p={3}
          >
            <Icon as={icon} /> 
          </Button>
        ))}
          </Flex> */}
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
