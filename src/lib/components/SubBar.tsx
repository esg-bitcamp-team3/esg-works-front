"use client";

import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Separator,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Resizable } from "re-resizable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Bar } from "react-chartjs-2";
import DraggableChartIcon from "./DraggableChartIcon";
import {
  getChart,
  getChartByType,
  getInterestChart,
  getInterestChartByType,
} from "../api/get";
import { ChartDetail, InteresrtChartDetail } from "../api/interfaces/chart";
import ChartMake from "./chart/ChartMake";
import cloneDeep from "lodash/cloneDeep";
import ChartModal from "./modal/chart-modal";

import {
  PiChartPieSlice,
  PiFolder,
  PiChartBar,
  PiChartLine,
  PiGridNine,
  PiSquaresFour,
  PiSquaresFourBold,
  PiStar,
  PiStarBold,
} from "react-icons/pi";
import SingleChart from "./chart/SingleChart";
// import { GoFileDirectory } from "react-icons/go";
// import { TfiPieChart } from "react-icons/tfi";
// import { BsBarChartLine } from "react-icons/bs";
// import { RiLineChartLine } from "react-icons/ri";
// import { CiViewTable } from "react-icons/ci";
// import { RxLayout } from "react-icons/rx";
// import { FaRegStar } from "react-icons/fa";
// import { FaRegFolder } from "react-icons/fa";

const items = [
  {
    icon: <PiFolder />,
    titleIcon: <PiFolder size={30} color="#2F6EEA" />,
    title: "전체파일",
  },
  {
    icon: <PiChartPieSlice />,
    titleIcon: <PiChartPieSlice size={30} color="#2F6EEA" />,
    title: "원그래프",
  },
  {
    icon: <PiChartBar />,
    titleIcon: <PiChartBar size={30} color="#2F6EEA" />,
    title: "막대그래프",
  },
  {
    icon: <PiChartLine />,
    titleIcon: <PiChartLine size={30} color="#2F6EEA" />,
    title: "꺾은선그래프",
  },
  {
    icon: <PiGridNine />,
    titleIcon: <PiGridNine size={30} color="#2F6EEA" />,
    title: "표",
  },
];

const Subbar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "star">("all");
  const [sidebarWidth, setSidebarWidth] = useState(350); // 👈 수정: 사이드바 너비 상태 추가
  const [entireChart, setEntireChart] = useState<ChartDetail[] | null>([]);
  const [lineChart, setLineChart] = useState<ChartDetail[] | null>([]);
  const [pieChart, setPieChart] = useState<ChartDetail[] | null>([]);
  const [barChart, setBarChart] = useState<ChartDetail[] | null>([]);
  const [doughnutChart, setDoughnutChart] = useState<ChartDetail[] | null>([]);
  const [polarAreaChart, setPolarAreaChart] = useState<ChartDetail[] | null>(
    []
  );
  const [radarChart, setRadarChart] = useState<ChartDetail[] | null>([]);
  const [mixChart, setMixChart] = useState<ChartDetail[] | null>([]);

  const [interestEntireChart, setInterestEntireChart] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [interestLineChart, setInterestLineChart] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [interestPieChart, setInterestPieChart] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [interestBarChart, setInterestBarChart] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [interestDoughnutChart, setInterestDoughnutChart] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [interestPolarAreaChart, setInterestPolarAreaChart] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [interestRadarChart, setInterestRadarChart] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [interestMixChart, setInterestMixChart] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const DEFAULT_SIDEBAR_WIDTH = 350;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 즐겨 찾기 차트 가져오기
  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      try {
        const [
          barData,
          lineData,
          pieData,
          doughnutData,
          mixData,
          entireData,
          interestBarData,
          interestLineData,
          interestPieData,
          interestDoughnutData,
          interestMixData,
          interestEntireData,
        ] = await Promise.all([
          getChartByType("bar"),
          getChartByType("line"),
          getChartByType("pie"),
          getChartByType("doughnut"),
          getChartByType("mix"),
          getChart(),
          getInterestChartByType("bar"),
          getInterestChartByType("line"),
          getInterestChartByType("pie"),
          getInterestChartByType("doughnut"),
          getInterestChartByType("mix"),
          getInterestChart(),
        ]);

        if (entireData && entireData.length > 0) {
          console.log("Fetched Entire data:", entireData);
          setEntireChart(entireData);
        } else {
          setError("전체 차트 데이터를 불러올 수 없습니다.");
        }

        if (barData && barData.length > 0) {
          console.log("Fetched Bar data:", barData);
          setBarChart(barData);
        } else {
          setError("Bar 차트 데이터를 불러올 수 없습니다.");
        }

        if (lineData && lineData.length > 0) {
          console.log("Fetched Line data:", lineData);
          setLineChart(lineData);
        } else {
          setError("Line 차트 데이터를 불러올 수 없습니다.");
        }

        if (pieData && pieData.length > 0) {
          console.log("Fetched Pie data:", pieData);
          setPieChart(pieData);
        } else {
          setError("Pie 차트 데이터를 불러올 수 없습니다.");
        }

        if (doughnutData && doughnutData.length > 0) {
          console.log("Fetched Doughnut data:", doughnutData);
          setDoughnutChart(doughnutData);
        } else {
          setError("Doughnut 차트 데이터를 불러올 수 없습니다.");
        }

        if (mixData && mixData.length > 0) {
          console.log("Fetched Mix data:", mixData);
          setMixChart(mixData);
        } else {
          setError("Mix 차트 데이터를 불러올 수 없습니다.");
        }

        if (interestEntireData && interestEntireData.length > 0) {
          console.log("Fetched Interest Entire data:", interestEntireData);
          setInterestEntireChart(interestEntireData);
        } else {
          setError("관심 전체 차트 데이터를 불러올 수 없습니다.");
        }
        if (interestBarData && interestBarData.length > 0) {
          console.log("Fetched Interest Bar data:", interestBarData);
          setInterestBarChart(interestBarData);
        } else {
          setError("관심 Bar 차트 데이터를 불러올 수 없습니다.");
        }
        if (interestLineData && interestLineData.length > 0) {
          console.log("Fetched Interest Line data:", interestLineData);
          setInterestLineChart(interestLineData);
        } else {
          setError("관심 Line 차트 데이터를 불러올 수 없습니다.");
        }
        if (interestPieData && interestPieData.length > 0) {
          console.log("Fetched Interest Pie data:", interestPieData);
          setInterestPieChart(interestPieData);
        } else {
          setError("관심 Pie 차트 데이터를 불러올 수 없습니다.");
        }
        if (interestDoughnutData && interestDoughnutData.length > 0) {
          console.log("Fetched Interest Doughnut data:", interestDoughnutData);
          setInterestDoughnutChart(interestDoughnutData);
        } else {
          setError("관심 Doughnut 차트 데이터를 불러올 수 없습니다.");
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
    <>
      <Box
        position="fixed"
        right={activeIndex !== null ? `${sidebarWidth}px` : "0px"} // ❗사이드바 너비에 따라 이동
        top="10"
        zIndex={1000}
      >
        <Box
          w="40px"
          h="30vh"
          bg="white"
          borderTopLeftRadius="xl"
          borderBottomLeftRadius="xl"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {items.map((item, idx) => (
            <Button
              key={idx}
              variant="ghost"
              color="#2F6EEA"
              onClick={() => setActiveIndex(idx)}
              w={"100%"}
            >
              {item.icon}
            </Button>
          ))}
        </Box>
      </Box>

      {activeIndex !== null && (
        <Resizable
          defaultSize={{ width: 350, height: window.innerHeight }}
          minWidth={350}
          maxWidth={900}
          enable={{ left: true }}
          onResize={(e, dir, ref) => {
            setSidebarWidth(ref.offsetWidth); // 실시간 반영
          }}
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            zIndex: 1000,
            backgroundColor: "white",
          }}
        >
          <Box
            height="100vh"
            width="100%"
            bg="white"
            padding="5"
            display="flex"
            flexDirection="column"
          >
            <HStack mb={4} justifyContent="space-between">
              <HStack>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={2}
                >
                  {items[activeIndex].titleIcon}
                  <Text
                    mb={0}
                    fontSize="md"
                    fontWeight="bold"
                    color="#2F6EEA"
                    position="relative"
                    style={{ verticalAlign: "bottom" }}
                  >
                    {items[activeIndex].title}
                  </Text>
                </Box>
              </HStack>
              <CloseButton
                onClick={() => {
                  setActiveIndex(null);
                  setSidebarWidth(DEFAULT_SIDEBAR_WIDTH); // 👈 유지보수성 굿
                }}
              />
            </HStack>

            <HStack flexDirection="column" w="100%">
              <Box
                display="flex"
                justifyContent="space-between"
                // gap="1"
                width="100%"
                bg="white"
                borderRadius="md"
                alignItems="center"
              >
                {/* 전체 버튼 */}
                <Button
                  bg="white"
                  // _hover={{ bg: "gray.100"}}
                  onClick={() => setSelectedTab("all")}
                  display="flex"
                  gap="3"
                  alignItems="center"
                  justifyContent="center"
                  paddingLeft="8"
                  paddingRight="6"
                >
                  {selectedTab === "all" ? (
                    <PiSquaresFourBold color="#2F6EEA" size="12px" />
                  ) : (
                    <PiSquaresFour color="gray" size="12px" />
                  )}
                  <Text
                    fontSize={{ base: "xs", md: "sm", lg: "md" }}
                    color={selectedTab === "all" ? "#2F6EEA" : "gray"}
                    fontWeight={selectedTab === "all" ? "bold" : "normal"}
                  >
                    전체
                  </Text>
                </Button>

                {/* 즐겨찾기 버튼 */}
                <Button
                  bg="white"
                  // _hover={{ bg: "gray.100" }}
                  gap="3" // 👈 아이콘과 텍스트 사이 간격
                  onClick={() => setSelectedTab("star")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  paddingLeft="3"
                  paddingRight="5"
                >
                  {selectedTab === "star" ? (
                    <PiStarBold color="#2F6EEA" size="12px" />
                  ) : (
                    <PiStar color="gray" size="12px" />
                  )}
                  <Text
                    fontSize={{ base: "xs", md: "sm", lg: "md" }}
                    color={selectedTab === "star" ? "#2F6EEA" : "gray"}
                    fontWeight={selectedTab === "star" ? "bold" : "normal"}
                  >
                    즐겨찾기
                  </Text>
                </Button>
                {/* 차트 추가 버튼 */}
                <ChartModal />
              </Box>
            </HStack>

            <Box
              width="100%"
              height="4px"
              display="flex"
              // mt="2"
              borderRadius="md"
              overflow="hidden"
              paddingRight="12"
            >
              <Box
                flex="1"
                bg={selectedTab === "all" ? "#2F6EEA" : "gray.200"}
                transition="background-color 0.3s ease"
              />
              <Box
                flex="1"
                bg={selectedTab === "star" ? "#2F6EEA" : "gray.200"}
                transition="background-color 0.3s ease"
              />
            </Box>

            {selectedTab === "all" && (
              <Box mt={6} flex="1" overflowY="auto">
                {activeIndex === 0 && (
                  <Flex flexDirection="column" gap={4}>
                    <Box p={4}>
                      <>
                        {pieChart &&
                          pieChart.map((data, index) => (
                            <Flex key={index} flexDirection="column" gap={5}>
                              <DraggableChartIcon chartType="pie" data={data}>
                                <SingleChart chartData={data || []} />
                              </DraggableChartIcon>
                            </Flex>
                          ))}
                        {lineChart &&
                          lineChart.map((data, index) => (
                            <Flex key={index} flexDirection="column" gap={5}>
                              <DraggableChartIcon chartType="line" data={data}>
                                <SingleChart chartData={data || []} />
                              </DraggableChartIcon>
                            </Flex>
                          ))}
                        {doughnutChart &&
                          doughnutChart.map((data, index) => (
                            <Flex key={index} flexDirection="column" gap={5}>
                              <DraggableChartIcon
                                chartType="dougnut"
                                data={data}
                              >
                                <SingleChart chartData={data || []} />
                              </DraggableChartIcon>
                            </Flex>
                          ))}
                        {barChart &&
                          barChart.map((data, index) => (
                            <Flex key={index} flexDirection="column" gap={5}>
                              <DraggableChartIcon chartType="bar" data={data}>
                                <SingleChart chartData={data || []} />
                              </DraggableChartIcon>
                            </Flex>
                          ))}
                      </>
                    </Box>
                  </Flex>
                )}
                {activeIndex === 1 && (
                  <Flex flexDirection="column" gap={4}>
                    <Box p={4}>
                      <>
                        {pieChart &&
                          pieChart.map((data, index) => (
                            <Flex key={index} flexDirection="column" gap={4}>
                              <DraggableChartIcon chartType="pie" data={data}>
                                <SingleChart chartData={data || []} />
                              </DraggableChartIcon>
                            </Flex>
                          ))}
                      </>
                    </Box>
                  </Flex>
                )}
                {activeIndex === 2 && (
                  <Flex flexDirection="column" gap={4}>
                    <Box p={4}>
                      <>
                        {barChart &&
                          barChart.map((data, index) => (
                            <Flex key={index} flexDirection="column" gap={4}>
                              <DraggableChartIcon chartType="bar" data={data}>
                                <SingleChart chartData={data || []} />
                              </DraggableChartIcon>
                            </Flex>
                          ))}
                      </>
                    </Box>
                  </Flex>
                )}
                {activeIndex === 3 && (
                  <Flex flexDirection="column" gap={4}>
                    <Box p={4}>
                      <>
                        {lineChart &&
                          lineChart.map((data, index) => (
                            <Flex key={index} flexDirection="column" gap={4}>
                              <DraggableChartIcon chartType="line" data={data}>
                                <SingleChart chartData={data || []} />
                              </DraggableChartIcon>
                            </Flex>
                          ))}
                      </>
                    </Box>
                  </Flex>
                )}
                {activeIndex === 4 && (
                  <Flex flexDirection="column" gap={4}>
                    <Box p={4}>
                      <>
                        {lineChart &&
                          lineChart.map((data, index) => (
                            <Flex key={index} flexDirection="column" gap={4}>
                              <DraggableChartIcon chartType="mix" data={data}>
                                <SingleChart chartData={data || []} />
                              </DraggableChartIcon>
                            </Flex>
                          ))}
                      </>
                    </Box>
                  </Flex>
                )}
              </Box>
            )}

            {/* 즐겨찾기 차트 */}
            {selectedTab === "star" &&
              (console.log("interestEntireChart", interestEntireChart),
              console.log("interestLineChart", interestLineChart),
              console.log("interestPieChart", interestPieChart),
              console.log("interestBarChart", interestBarChart),
              console.log("interestDoughnutChart", interestDoughnutChart),
              (
                <Box mt={6} flex="1" overflowY="auto">
                  {activeIndex === 0 && (
                    <Flex flexDirection="column" gap={4}>
                      <Box p={4}>
                        <>
                          {interestPieChart &&
                            interestPieChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="pie"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                          {interestBarChart &&
                            interestBarChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="bar"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                          {interestLineChart &&
                            interestLineChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="line"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                          {interestDoughnutChart &&
                            interestDoughnutChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="doughnut"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                          {interestMixChart &&
                            interestMixChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="mix"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                        </>
                      </Box>
                    </Flex>
                  )}
                  {activeIndex === 1 && (
                    <Flex flexDirection="column" gap={4}>
                      <Box p={4}>
                        <>
                          {interestEntireChart &&
                            interestEntireChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="line"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                        </>
                      </Box>
                    </Flex>
                  )}
                  {activeIndex === 2 && (
                    <Flex flexDirection="column" gap={4}>
                      <Box p={4}>
                        <>
                          {interestBarChart &&
                            interestBarChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="bar"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                        </>
                      </Box>
                    </Flex>
                  )}
                  {activeIndex === 3 && (
                    <Flex flexDirection="column" gap={4}>
                      <Box p={4}>
                        <>
                          {interestLineChart &&
                            interestLineChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="line"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                        </>
                      </Box>
                    </Flex>
                  )}
                  {activeIndex === 4 && (
                    <Flex flexDirection="column" gap={4}>
                      <Box p={4}>
                        <>
                          {interestLineChart &&
                            interestLineChart.map((data, index) => (
                              <Flex key={index} flexDirection="column" gap={5}>
                                <DraggableChartIcon
                                  chartType="doughnut"
                                  data={data.chartDetail}
                                >
                                  <SingleChart
                                    chartData={data.chartDetail || []}
                                  />
                                </DraggableChartIcon>
                              </Flex>
                            ))}
                        </>
                      </Box>
                    </Flex>
                  )}
                </Box>
              ))}
          </Box>
        </Resizable>
      )}
    </>
  );
};

export default Subbar;
