"use client";

import {
  Box,
  Button,
  CloseButton,
  Color,
  Flex,
  HStack,
  Icon,
  parseColor,
  Stack,
  Text,
  VStack,
  type StackProps,
  Drawer,
  Portal,
  ButtonGroup,
} from "@chakra-ui/react";

import { Chart } from "react-chartjs-2";

import { useEffect, useState, forwardRef, useRef } from "react";

import {
  FcBarChart,
  FcComboChart,
  FcDoughnutChart,
  FcLineChart,
  FcPieChart,
} from "react-icons/fc";

import { getEsgData } from "@/lib/api/get";
import { DatasetType, DataType } from "@/lib/api/interfaces/chart";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";

// Add this import at the top with other imports
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
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

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface ChartContentProps {
  categorizedEsgDataList: CategorizedESGDataList[];
  charts: {
    type: string;
    label: string;
    icons: React.ElementType;
  }[];
  children?: React.ReactNode;
}
const ChartContent = forwardRef<HTMLDivElement, ChartContentProps>(
  ({ categorizedEsgDataList, charts, children }, ref) => {
    const [chartData, setChartData] = useState<DataType>();
    const [selectedChartType, setSelectedChartType] =
      useState<'line' | 'bar' | 'pie' | 'doughnut'>('bar');
    const [selectedColors, setSelectedColors] = useState<Color[]>([]);

    const [backgroundColor, setBackgroundColor] = useState(
      parseColor("#ffffff")
    );

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
            selectedColors[idx]?.toString("hex") ||
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

    const chartAreaRef = useRef<HTMLDivElement | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [chartAreaOpen, setChartAreaOpen] = useState(false);

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
        ref={ref}
      >
        {/* 차트 타입 선택 & 차트 수정 버튼 */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="3"
          w="100%"
        >
          {/* 차트 타입 선택 버튼 =================================================== */}
          <Stack
            direction="row"
            align="auto"
            width="100%"
            // maxHeight={{ base: "30vh", md: "45vh", lg: "35vh" }}
            // padding={3}
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
          <Button
            onClick={() => setChartAreaOpen((prev) => !prev)}
            bg="#2F6EEA"
          >
            수정
          </Button>
          {/* <Drawer.Root onOpenChange={(details) => setDrawerOpen(details.open)}>
            <Drawer.Trigger asChild>
              <Button>차트 수정</Button>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content w="260px">
                  <Drawer.Header>
                    <Drawer.Title>차트 타입 선택</Drawer.Title>
                    <Drawer.CloseTrigger asChild>
                      <CloseButton />
                    </Drawer.CloseTrigger>
                  </Drawer.Header>
                  <Drawer.Body>
                    <Stack direction="column" gap={4}>
                      {charts.map((chart) => (
                        <Button
                          key={chart.type}
                          onClick={() =>
                            setSelectedChartType(
                              chart.type as typeof selectedChartType
                            )
                          }
                          variant="ghost"
                          // leftIcon={<Icon as={chart.icons} />}
                        >
                          {chart.label}
                        </Button>
                      ))}
                    </Stack>
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root> */}
          {/* {children} */}
        </Box>

        {/* 차트 및 차트 색상 커스텀 */}
        <Stack direction="row" width="100%" p={0} gap={0}>
          <Stack
            ref={chartAreaRef}
            // transition='all 0.3s ease-in-out'
            style={{
              // transition: "all 0.3s ease-in-out",
              flex: chartAreaOpen ? "4" : "5",
            }}
            align={{ base: "flex-start", md: "center", lg: "flex-start" }}
            minHeight={{ base: "30vh", md: "45vh", lg: "50vh" }}
            maxHeight={{ base: "30vh", md: "45vh", lg: "60vh" }}
            width="100%"
            textAlign={{ base: "left", md: "center" }}
            outline={"1px solid #E2E8F0"}
            padding={3}
            overflow="hidden"
            borderRadius="md"
          >
            {!chartData || !chartData.labels || !chartData.datasets ? (
              <Text fontSize="sm" color="gray.500">
                차트를 불러올 수 없습니다.
              </Text>
            ) : (
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
          </Stack>

          <Stack
            // style={{
            //   // transition: "all 0.3s ease-in-out",
            //   opacity: chartAreaOpen ? 1 : 0,
            //   width: chartAreaOpen ? "100%" : "0%",
            //   flex: chartAreaOpen ? "2" : "0",
            // }}
            align={{ base: "flex-start", md: "center", lg: "flex-start" }}
            minHeight={{ base: "30vh", md: "45vh", lg: "50vh" }}
            maxHeight={{ base: "30vh", md: "45vh", lg: "60vh" }}
            textAlign={{ base: "left", md: "center" }}
            outline={"1px solid #E2E8F0"}
            overflow="hidden"
            // transition="transform 0.4s cubic-bezier(.44,0,.56,1), opacity 0.4s, width 0.4s"
            transition="all 0.3s ease-in-out"
            opacity={chartAreaOpen ? 1 : 0}
            width={chartAreaOpen ? "100%" : "0%"}
            pointerEvents={chartAreaOpen ? "auto" : "none"}
            flex={chartAreaOpen ? 2 : 0}
            marginLeft={chartAreaOpen ? 3 : 0}
            bg="#E8F3FF"
            borderRadius="md"
            // style={{
            //   transition:
            //     "transform 0.4s cubic-bezier(.44,0,.56,1), opacity 0.3s, width 0.3s",
            //   transform: chartAreaOpen ? "translateX(0)" : "translateX(120px)", // 120px 정도는 완전히 오른쪽으로 밀려서 안 보이게!
            //   opacity: chartAreaOpen ? 1 : 0,
            //   width: chartAreaOpen ? "320px" : "0px", // Drawer 넓이에 맞게 px값 조정
            //   pointerEvents: chartAreaOpen ? "auto" : "none",
            //   marginLeft: chartAreaOpen ? 3 : 0,
            //   zIndex: 2,
            // }}
          >
            <Box w="100%" padding={3}>
              {chartAreaOpen && (
                <ChartColor
                  categorizedEsgDataList={categorizedEsgDataList}
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                />
              )}
            </Box>
          </Stack>

          {/* <Box flex="2" outline={"1px solid #E2E8F0"}> */}
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
          {/* <ChartColor
            categorizedEsgDataList={categorizedEsgDataList}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
          /> */}
          {/* </Box> */}
        </Stack>
      </Flex>
    );
  }
);

const DrawerChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  return (
    <Drawer.Root>
      <ChartContent ref={chartRef} categorizedEsgDataList={[]} charts={[]}>
        <Drawer.Trigger asChild>
          <Button variant="outline" size="sm">
            Open Drawer
          </Button>
        </Drawer.Trigger>
      </ChartContent>
      <Portal container={chartRef}>
        <Drawer.Positioner pos="absolute" boxSize="full">
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Drawer Title</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default DrawerChart;
