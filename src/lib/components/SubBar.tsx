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
import { GoFileDirectory } from "react-icons/go";
import { TfiPieChart } from "react-icons/tfi";
import { BsBarChartLine } from "react-icons/bs";
import { RiLineChartLine } from "react-icons/ri";
import { CiViewTable } from "react-icons/ci";
import { useState, useEffect, useRef } from "react";
import { RxLayout } from "react-icons/rx";
import { FaRegStar } from "react-icons/fa";
import Chart, { ChartTypeRegistry } from "chart.js/auto";
import { Resizable } from "re-resizable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableChartIcon from "./DraggableChartIcon";
import { getChart, getChartByType, getInterestChart } from "../api/get";
import { ChartDetail, InteresrtChartDetail } from "../api/interfaces/chart";
import { Bar } from "react-chartjs-2";
import ChartMake from "./chart/ChartMake";

const items = [
  {
    icon: <GoFileDirectory />,
    titleIcon: <GoFileDirectory size={30} color="#2F6EEA" />,
    title: "전체파일",
  },
  {
    icon: <TfiPieChart />,
    titleIcon: <TfiPieChart size={30} color="#2F6EEA" />,
    title: "원그래프",
  },
  {
    icon: <BsBarChartLine />,
    titleIcon: <BsBarChartLine size={30} color="#2F6EEA" />,
    title: "막대그래프",
  },
  {
    icon: <RiLineChartLine />,
    titleIcon: <RiLineChartLine size={30} color="#2F6EEA" />,
    title: "꺾은선그래프",
  },
  {
    icon: <CiViewTable />,
    titleIcon: <CiViewTable size={30} color="#2F6EEA" />,
    title: "표",
  },
];

const Subbar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "star">("all");
  const [sidebarWidth, setSidebarWidth] = useState(350); // 👈 수정: 사이드바 너비 상태 추가
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  const [interestChart, setInterestChart] = useState<
    InteresrtChartDetail[] | null
  >(null);

  const DEFAULT_SIDEBAR_WIDTH = 350;

  // 즐겨 찾기 차트 가져오기
  useEffect(() => {
    const fetchChart = async () => {
      setLoading(true);
      try {
        const barData = await getChartByType("bar");
        const lineData = await getChartByType("line");
        const pieData = await getChartByType("pie");
        const doughnutData = await getChartByType("doughnut");
        const polarAreaData = await getChartByType("polarArea");
        const radarData = await getChartByType("radar");
        const mixData = await getChartByType("mix");
        const entireData = await getChart();

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

        if (polarAreaData && polarAreaData.length > 0) {
          console.log("Fetched PolarArea data:", polarAreaData);
          setPolarAreaChart(polarAreaData);
        } else {
          setError("PolarArea 차트 데이터를 불러올 수 없습니다.");
        }

        if (radarData && radarData.length > 0) {
          console.log("Fetched Radar data:", radarData);
          setRadarChart(radarData);
        } else {
          setError("Radar 차트 데이터를 불러올 수 없습니다.");
        }

        if (mixData && mixData.length > 0) {
          console.log("Fetched Mix data:", mixData);
          setMixChart(mixData);
        } else {
          setError("Mix 차트 데이터를 불러올 수 없습니다.");
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
                width="100%"
                bg="white"
                borderRadius="md"
                padding="0"
              >
                {/* 전체 버튼 */}
                <Button
                  bg="white"
                  _hover={{ bg: "gray.100", pr: "46px" }}
                  onClick={() => setSelectedTab("all")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  pl={12}
                >
                  <RxLayout
                    color={selectedTab === "all" ? "#2F6EEA" : "gray"}
                    size="12px" // 👈 작은 화면용으로 크기 제한
                  />
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
                  _hover={{ bg: "gray.100", pl: "30px" }}
                  gap={1} // 👈 아이콘과 텍스트 사이 간격
                  onClick={() => setSelectedTab("star")}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  pr={8}
                >
                  <FaRegStar
                    color={selectedTab === "star" ? "#2F6EEA" : "gray"}
                    size="12px" // 👈 작은 화면용으로 크기 제한
                  />
                  <Text
                    ml={2}
                    fontSize={{ base: "xs", md: "sm", lg: "md" }}
                    color={selectedTab === "star" ? "#2F6EEA" : "gray"}
                    fontWeight={selectedTab === "star" ? "bold" : "normal"}
                  >
                    즐겨찾기
                  </Text>
                </Button>
              </Box>
            </HStack>

            <Box
              width="100%"
              height="4px"
              display="flex"
              mt="2"
              borderRadius="md"
              overflow="hidden"
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

            {/* all 탭과 star 탭에 따라 다른 내용 보여주기 */}
            {selectedTab === "all" && (
              <Box mt={6} flex="1" overflowY="auto">
                {activeIndex === 0 && (
                  <>
                    {pieChart &&
                      pieChart.map((data, index) => (
                        <Flex key={index} flexDirection="column" gap={4}>
                          <DraggableChartIcon chartType="pie">
                            <ChartMake chartData={data || []} />
                          </DraggableChartIcon>
                        </Flex>
                      ))}
                  </>
                )}
                {activeIndex === 1 && (
                  <>
                    {lineChart &&
                      lineChart.map((data, index) => (
                        <Flex key={index} flexDirection="column" gap={4}>
                          <DraggableChartIcon chartType="line">
                            <ChartMake chartData={data || []} />
                          </DraggableChartIcon>
                        </Flex>
                      ))}
                  </>
                )}

                {/* {activeIndex === 2 && (
                  <Box p={4}>
                    <DraggableChartIcon chartType="bar">
                      <canvas
                        ref={canvasEl1}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </DraggableChartIcon>
                  </Box>
                )}
                {activeIndex === 3 && (
                  <Box p={4}>
                    <DraggableChartIcon chartType="line">
                      <canvas
                        ref={canvasEl}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </DraggableChartIcon>
                  </Box>
                )} */}
              </Box>
            )}
          </Box>
        </Resizable>
      )}
    </>
  );
};

export default Subbar;
