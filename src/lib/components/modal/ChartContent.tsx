import {
  Box,
  Button,
  Color,
  Flex,
  HStack,
  Icon,
  parseColor,
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
// import ChartDataLabels from "chartjs-plugin-datalabels";
import { getEsgData } from "@/lib/api/get";
import { ChartType, DatasetType, DataType } from "@/lib/api/interfaces/chart";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";

// Add this import at the top with other imports
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  layouts,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import BarChartColor from "./barChartColor";
import LineChartColor from "./LineChartColor";
import PieChartColor from "./PieChartColor";
import MixedChartColor from "./MixedChartColor";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the ChartDataLabels plugin
);
export interface ChartContentProps {
  selectedChartType: ChartType["type"];
  setSelectedChartType: (type: ChartType["type"]) => void;
  categorizedEsgDataList: CategorizedESGDataList[];
  chartData: ChartData;
  setChartData: (data: ChartData) => void;
  options: ChartOptions;
  setOptions: (data: ChartOptions) => void;
  formatOptions: Record<string, Object>;
  setFormatOptions: (options: Record<string, Object>) => void;
}

const ChartContent = ({
  selectedChartType,
  setSelectedChartType,
  categorizedEsgDataList,
  chartData,
  setChartData,
  options,
  setOptions,
  formatOptions,
  setFormatOptions,
}: ChartContentProps) => {
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onChartTypeChange = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to force re-render
  };

  const getChartOptions = (): ChartOptions<
    "bar" | "line" | "pie" | "doughnut"
  > => {
    // Base options that apply to all chart types
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          right: 40,
        },
      },
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            font: {
              size: 12,
            },
          },
        },
        title: {
          display: true,
          text: "ESG Data Visualization",
          font: {
            size: 16,
          },
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          display: false,
        },
      },
    };

    // For pie/doughnut charts, we need different configuration
    if (selectedChartType === "bar") {
      return {
        ...baseOptions,
        cutout: selectedChartType === "bar" ? "50%" : 0,
        plugins: {
          ...baseOptions.plugins,
          legend: {
            ...baseOptions.plugins.legend,
            position: "right" as const,
          },
        },
      };
    }

    // For other chart types, add scales
    return {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  };

  useEffect(() => {
    if (categorizedEsgDataList.length > 0) {
      const years = Array.from(
        new Set(
          categorizedEsgDataList.flatMap((category) =>
            category.esgNumberDTOList.map((data) => data.year)
          )
        )
      ).sort();

      let newChartData;

      switch (selectedChartType) {
        case "pie":
        case "doughnut": {
          if (categorizedEsgDataList.length === 1) {
            // If there's only one category, use years as labels
            const category = categorizedEsgDataList[0];

            const backgroundColors = category.esgNumberDTOList.map((_, idx) => {
              // Generate random color and update selectedColors
              const hex = Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0");
              const randomColor = parseColor(`#${hex}`);
              return randomColor.toString("rgba");
            });

            newChartData = {
              // Use years from this single category as labels
              labels: category.categoryName,
              datasets: [
                {
                  type: selectedChartType,
                  label: category.categoryDetailDTO.categoryName,
                  data: category.esgNumberDTOList.map((data) => data.value),
                  backgroundColor: backgroundColors,
                  borderColor: backgroundColors.map((color) => color),
                  borderWidth: 1,
                  hoverOffset: 4,
                },
              ],
            };
          } else {
            // Get the most recent year for all categories
            const mostRecentYear = Math.max(
              ...years.map((year) => Number(year))
            ).toString();

            // Generate background colors based on selectedColors or random fallback
            const backgroundColors = categorizedEsgDataList.map((_, idx) => {
              const hex = Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0");
              const randomColor = parseColor(`#${hex}`);
              return randomColor.toString("rgba");
            });

            newChartData = {
              labels: categorizedEsgDataList.map(
                (category) => category.categoryDetailDTO.categoryName
              ),
              datasets: [
                {
                  type: selectedChartType,
                  label: `Data for ${mostRecentYear}`,
                  data: categorizedEsgDataList.map((category) => {
                    const yearData = category.esgNumberDTOList.find(
                      (data) => data.year === mostRecentYear
                    );
                    return yearData ? yearData.value : 0;
                  }),
                  backgroundColor: backgroundColors,
                  borderColor: backgroundColors.map((color) => color),
                  borderWidth: 1,
                  hoverOffset: 4,
                },
              ],
            };
          }
          break;
        }

        case "mixed": {
          // Logic for mixed charts (bar and line)
          newChartData = {
            labels: years.map((year) => year.toString()),
            datasets: categorizedEsgDataList.map((category, idx) => {
              const color = `#${Math.floor(Math.random() * 16777215).toString(
                16
              )}`;

              return {
                // Alternate between bar and line based on index
                type: "line",
                label: category.categoryDetailDTO.categoryName,
                data: years.map((year) => {
                  const yearData = category.esgNumberDTOList.find(
                    (data) => data.year === year
                  );
                  return yearData ? yearData.value : 0;
                }),
                borderColor: color,
                backgroundColor: color,
                borderWidth: 1,
                pointRadius: 3,
                fill: false,
              };
            }),
          };
          break;
        }

        default: {
          // For bar and line charts
          newChartData = {
            labels: years.map((year) => year.toString()),
            datasets: categorizedEsgDataList.map((category, idx) => {
              const color = `#${Math.floor(Math.random() * 16777215).toString(
                16
              )}`;

              return {
                type: selectedChartType,
                label: category.categoryDetailDTO.categoryName,
                data: years.map((year) => {
                  const yearData = category.esgNumberDTOList.find(
                    (data) => data.year === year
                  );
                  return yearData ? yearData.value : 0;
                }),
                borderColor: color,
                backgroundColor: color,
                borderWidth: 1,
                pointRadius: 3,
                fill: false,
              };
            }),
          };
          break;
        }
      }

      setChartData(newChartData as ChartData);
    }
  }, [categorizedEsgDataList, selectedChartType]);

  const handleChartTypeChange = (type: ChartType["type"]) => {
    setLoading(true); // Start loading when chart type changes
    setSelectedChartType(type);
    console.log("type: ", type);
  };

  const handleChartDataChange = (
    newChartData: ChartData<"bar" | "line" | "pie" | "doughnut">
  ) => {
    setLoading(true); // Start loading when chart data changes
    try {
      setChartData(newChartData);
    } catch (error) {
      console.error("Error updating chart data:", error);
    } finally {
      setLoading(false); // Stop loading after chart data is set
    }
  };

  useEffect(() => {
    console.log("Selected chart type:", selectedChartType);
    // If a chart type is selected, update the options
    if (selectedChartType) {
      setLoading(true); // Ensure loading is true when options are being set
      try {
        let option: ChartOptions = getChartOptions();
        console.log("Chart options before update:", option);
        setOptions(option);
      } catch (error) {
        console.error("Error setting chart options:", error);
        setOptions({}); // Reset options in case of error
      } finally {
        // Turn off loading after options are set
        setLoading(false);
      }
    }
  }, [selectedChartType]);

  const [chartAreaOpen, setChartAreaOpen] = useState(false);

  return (
    <Flex
      direction={{ base: "column", md: "column" }}
      justifyContent={{ base: "center", md: "space-between" }}
      alignItems={{ base: "flex-start", md: "center" }}
      minHeight={{ base: "45vh", md: "35vh", lg: "30vh" }}
      maxHeight={{ base: "50vh", md: "40vh", lg: "80vh" }}
      width="100%"
      gap="4"
      p="1"
    >
      {/* 차트 타입 선택 & 차트 수정 옵션 */}
      <Stack direction="row" width="100%" justifyContent="space-between">
        <Stack
          direction="row"
          align="auto"
          width="100%"
          // maxHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
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
              onClick={() => handleChartTypeChange(type as ChartType["type"])}
              variant="outline"
              colorScheme="blue"
              textAlign="left"
              justifyContent="flex-start"
              p="3"
            >
              <Icon as={icon} />
            </Button>
          ))}
        </Stack>
        <Button onClick={() => setChartAreaOpen((prev) => !prev)} bg="#2F6EEA">
          수정
        </Button>
      </Stack>

      {/* 차트 및 차트 색상 커스텀 */}
      <Stack
        direction="row"
        width="100%"
        gap={0}
        minHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
        maxHeight={{ base: "30vh", md: "45vh", lg: "50vh" }}
      >
        {/* <Stack direction="row" width="100%" p={0} gap={0}> */}
        <VStack
          align={{ base: "flex-start", md: "center", lg: "flex-start" }}
          flex={chartAreaOpen ? "4" : "5"}
          width="100%"
          // height="100%"
          minHeight={{ base: "30vh", md: "45vh", lg: "50vh" }}
          // maxHeight="50vh"
          textAlign={{ base: "left", md: "center" }}
          outline={"1px solid #E2E8F0"}
          padding={3}
          gap={0}
          margin={0}
          overflow="hidden"
          borderRadius="md"
        >
          {!chartData || !chartData.labels || !chartData.datasets ? (
            <Text fontSize="sm" color="gray.500">
              차트를 불러올 수 없습니다.
            </Text>
          ) : loading ? (
            <Text fontSize="sm" color="gray.500">
              차트를 불러오는 중입니다...
            </Text>
          ) : (
            // 차트를 화면에 렌더링
            <Box
              width="100%"
              height="100%"
              mt={4}
              overflow="hidden"
              justifyContent="center"
              justifyItems="center"
            >
              <Chart
                key={refreshKey} // Use refreshKey to force re-render
                type={selectedChartType === "mixed" ? "bar" : selectedChartType}
                data={chartData}
                options={options}
              />
            </Box>
          )}
        </VStack>

        <Box
          padding={chartAreaOpen ? "3" : "0"}
          minHeight={{ base: "30vh", md: "45vh", lg: "50vh" }}
          // maxHeight={{ base: "30vh", md: "45vh", lg: "60vh" }}
          textAlign={{ base: "left", md: "center" }}
          outline={"1px solid #E2E8F0"}
          transition="all 0.3s ease-in-out"
          opacity={chartAreaOpen ? 1 : 0}
          width={chartAreaOpen ? "100%" : "0%"}
          overflowY={"auto"}
          maxHeight="300px"
          pointerEvents={chartAreaOpen ? "auto" : "none"}
          flex={chartAreaOpen ? 2 : 0}
          marginLeft={chartAreaOpen ? 3 : 0}
          bg="#E8F3FF"
          borderRadius="md"
        >
          {loading ? (
            <Text fontSize="sm" color="gray.500">
              차트 색상을 불러오는 중입니다...
            </Text>
          ) : (
            <>
              {selectedChartType === "bar" && (
                <BarChartColor
                  chartData={
                    (chartData as ChartData<"bar">) || {
                      labels: [],
                      datasets: [],
                    }
                  }
                  setChartData={
                    handleChartDataChange as (data: ChartData<"bar">) => void
                  }
                  options={options as ChartOptions<"bar">}
                  setOptions={
                    setOptions as (chartOptions: ChartOptions<"bar">) => void
                  }
                  formatOptions={formatOptions}
                  setFormatOptions={setFormatOptions}
                />
              )}
              {selectedChartType === "line" && (
                <LineChartColor
                  chartData={
                    (chartData as ChartData<"line">) || {
                      labels: [],
                      datasets: [],
                    }
                  }
                  setChartData={
                    handleChartDataChange as (data: ChartData<"line">) => void
                  }
                  options={options as ChartOptions<"line">}
                  setOptions={
                    setOptions as (chartOptions: ChartOptions<"line">) => void
                  }
                  formatOptions={formatOptions}
                  setFormatOptions={setFormatOptions}
                />
              )}
              {selectedChartType === "pie" && (
                <PieChartColor
                  chartData={
                    (chartData as ChartData<"pie" | "doughnut">) || {
                      labels: [],
                      datasets: [],
                    }
                  }
                  setChartData={
                    setChartData as (
                      data: ChartData<"pie" | "doughnut">
                    ) => void
                  }
                  options={options as ChartOptions<"pie" | "doughnut">}
                  setOptions={
                    setOptions as (
                      chartOptions: ChartOptions<"pie" | "doughnut">
                    ) => void
                  }
                  formatOptions={formatOptions}
                  setFormatOptions={setFormatOptions}
                />
              )}
              {selectedChartType === "doughnut" && (
                <PieChartColor
                  chartData={
                    (chartData as ChartData<"pie" | "doughnut">) || {
                      labels: [],
                      datasets: [],
                    }
                  }
                  setChartData={
                    setChartData as (
                      data: ChartData<"pie" | "doughnut">
                    ) => void
                  }
                  options={options as ChartOptions<"pie" | "doughnut">}
                  setOptions={
                    setOptions as (
                      chartOptions: ChartOptions<"pie" | "doughnut">
                    ) => void
                  }
                  formatOptions={formatOptions}
                  setFormatOptions={setFormatOptions}
                />
              )}
              {selectedChartType === "mixed" && (
                <MixedChartColor
                  chartData={
                    (chartData as ChartData<"bar" | "line">) || {
                      labels: [],
                      datasets: [],
                    }
                  }
                  setChartData={
                    handleChartDataChange as (
                      data: ChartData<"bar" | "line">
                    ) => void
                  }
                  options={options as ChartOptions<"bar" | "line">}
                  setOptions={
                    setOptions as (
                      chartOptions: ChartOptions<"bar" | "line">
                    ) => void
                  }
                  onChartTypeChange={onChartTypeChange}
                  formatOptions={formatOptions}
                  setFormatOptions={setFormatOptions}
                />
              )}
            </>
          )}
        </Box>
      </Stack>
    </Flex>
  );
};

export default ChartContent;
