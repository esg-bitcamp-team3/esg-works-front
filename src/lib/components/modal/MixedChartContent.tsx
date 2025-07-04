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
import ChartDataLabels from "chartjs-plugin-datalabels";
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
} from "chart.js";
import ChartColor from "./chartColor";
import { get } from "http";
import PieChartColor from "./PieChartColor";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";
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
  categorizedEsgDataList: CategorizedESGDataList[];
  charts: {
    type: string;
    label: string;
    icons: React.ElementType;
  }[];
}

const MixedChartContent = ({
  categorizedEsgDataList,
  charts,
}: ChartContentProps) => {
  const [chartData, setChartData] = useState<ChartData>();
  const [selectedChartType, setSelectedChartType] =
    useState<ChartType["type"]>("bar");
  const [options, setOptions] = useState<ChartOptions>({});
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
          enabled: false,
        },
        datalabels: {
          display: true,
          formatter: (value: number, context: any) => {
            // Display the value with a comma as a thousands separator
            return value.toLocaleString();
          },
          anchor: "end" as const,
          align: "center" as const,
          font: {
            weight: "bold" as const,
          },
          color: "#fff",
        },
      },
    };

    // For pie/doughnut charts, we need different configuration
    if (selectedChartType === "pie" || selectedChartType === "doughnut") {
      return {
        ...baseOptions,
        cutout: selectedChartType === "doughnut" ? "50%" : 0,
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
          ticks: {
            precision: 0,
          },
        },
        x: {
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 0,
          },
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
              labels: category.esgNumberDTOList.map((data) =>
                data.year.toString()
              ),
              datasets: [
                {
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
                type: idx % 2 === 0 ? "bar" : "line",
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

  useEffect(() => {
    // Log the chart data and options whenever they change
    console.log("Chart data:", chartData);
    console.log("Chart options:", options);
  }, [chartData, options]);

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

  return (
    <Flex
      direction={{ base: "column", md: "column" }}
      justifyContent={{ base: "center", md: "space-between" }}
      alignItems={{ base: "flex-start", md: "center" }}
      minHeight={{ base: "45vh", md: "35vh", lg: "30vh" }}
      maxHeight={{ base: "50vh", md: "40vh", lg: "80vh" }}
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
            onClick={() => handleChartTypeChange(type as ChartType["type"])}
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
      <Stack
        direction="row"
        width="100%"
        gap="4"
        minHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
        maxHeight={{ base: "30vh", md: "45vh", lg: "50vh" }}
      >
        <VStack
          align={{ base: "flex-start", md: "center", lg: "flex-start" }}
          flex="3"
          width="100%"
          height={"100%"}
          textAlign={{ base: "left", md: "center" }}
          outline={"1px solid #E2E8F0"}
          padding={3}
          overflow="hidden"
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
                key={refreshKey} // Use key to force re-render when chart type changes
                type={selectedChartType === "mixed" ? "bar" : selectedChartType}
                data={chartData}
                options={options}
              />
            </Box>
          )}
        </VStack>
        <Box
          flex="2"
          outline={"1px solid #E2E8F0"}
          overflowY={"auto"}
          maxHeight="300px"
          height={"100%"}
          padding={3}
        >
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
          {loading ? (
            <Text fontSize="sm" color="gray.500">
              차트 색상을 불러오는 중입니다...
            </Text>
          ) : selectedChartType === "mixed" ? (
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
            />
          ) : null}
        </Box>
      </Stack>
    </Flex>
  );
};

export default MixedChartContent;
