import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useEditable,
  VStack,
} from "@chakra-ui/react";

import { Chart } from "react-chartjs-2";

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

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
    title: {
      display: true,
      text: "데이터 시각화",
    },
  },
};

const ChartContent = ({ categoryId, selected, charts }: ChartContentProps) => {
  const [chartData, setChartData] = useState<DataType>(); // or import the correct ChartData type if preferred
  const [categorizedEsgDataList, setCategorizedEsgDataList] = useState<
    CategorizedESGDataList[]
  >([]);

  // Add state for selectedColors and backgroundColor
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  // ESG 데이터 가져오기
  useEffect(() => {
    Promise.all(categoryId.map((id) => getEsgData(id)))
      .then((results) => {
        const validResults = results.filter(
          (result): result is CategorizedESGDataList => result !== null
        );
        setCategorizedEsgDataList(validResults);
        console.log(validResults);
      })
      .catch((error) => {
        console.error("Error fetching ESG data:", error);
      });
  }, [categoryId, selected]);

  const [selectedChartType, setSelectedChartType] =
    useState<DatasetType["type"]>("bar");

  // 차트용 데이터 구성 (Setting chartData)
  // Inside the useEffect that sets chartData
  useEffect(() => {
    if (categorizedEsgDataList.length > 0) {
      const years = Array.from(
        new Set(
          categorizedEsgDataList.flatMap((category) =>
            category.esgNumberDTOList.map((data) => data.year)
          )
        )
      ).sort();

      const datasets = categorizedEsgDataList.map((category) => {
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

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
  }, [categorizedEsgDataList, selectedChartType]);

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent={{ base: "center", md: "space-between" }}
      alignItems={{ base: "flex-start", md: "center" }}
      minHeight={{ base: "45vh", md: "35vh", lg: "30vh" }}
      maxHeight={{ base: "50vh", md: "40vh", lg: "40vh" }}
      overflowY="auto"
      width="100%"
      // height="100%"
      gap={4}
      p="1"
    >
      <VStack
        gap={3}
        align="auto"
        width="100%"
        flex={{ base: "1", md: "1.2", lg: "1" }}
        overflow="auto"
        maxHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
        marginLeft={1}
        padding={3}
        borderRadius="md"
        outline={"1px solid #E2E8F0"}
      >
        {[
          "bar",
          "line",
          "pie",
          "doughnut",
          "radar",
          "polarArea",
          "scatter",
          "bubble",
        ].map((type) => (
          <Button
            key={type}
            onClick={() =>
              setSelectedChartType(type as typeof selectedChartType)
            }
            variant="outline"
            colorScheme="blue"
            width="full"
            textAlign="left"
            justifyContent="flex-start"
            // height="fit-content"
            p={3}
          >
            {type.toUpperCase()}
          </Button>
        ))}
      </VStack>
      <VStack
        align={{ base: "flex-start", md: "center", lg: "flex-start" }}
        minHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
        maxHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
        flex="3"
        width="100%"
        textAlign={{ base: "left", md: "center" }}
        outline={"1px solid #E2E8F0"}
        padding={3}
      >
        <HStack
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="lg" fontWeight="bold" color="#2F6EEA">
            선택된 지표:
          </Text>
          <ChartColor
            categorizedEsgDataList={categorizedEsgDataList}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
          />
        </HStack>
        {!chartData || !chartData.labels || !chartData.datasets ? (
          <Text fontSize="sm" color="gray.500">
            차트를 불러올 수 없습니다.
          </Text>
        ) : (
          <Box
            width="100%"
            // height="30vh"
            justifyContent="center"
            alignContent="center"
            mt={4}
          >
            <Chart
              type={selectedChartType}
              data={chartData}
              // options={chartOptions}
            />
          </Box>
        )}
      </VStack>
    </Flex>
  );
};

export default ChartContent;
