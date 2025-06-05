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
import Chart from "chart.js/auto";
import { Resizable } from "re-resizable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableChartIcon from "./DraggableChartIcon";

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
  const canvasEl = useRef(null);
  const canvasEl1 = useRef(null);
  const canvasEl2 = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(350); // 👈 수정: 사이드바 너비 상태 추가
  const pieChartRef = useRef<Chart | null>(null);
  const barChartRef = useRef<Chart | null>(null);
  const lineChartRef = useRef<Chart | null>(null);
  const DEFAULT_SIDEBAR_WIDTH = 350;
  useEffect(() => {
    if (canvasEl2.current) {
      const existing = Chart.getChart(canvasEl2.current);
      if (existing) existing.destroy();
      pieChartRef.current = new Chart(canvasEl2.current, {
        type: "doughnut",
        data: {
          labels: ["Red", "Blue", "Yellow"],
          datasets: [
            {
              label: "My First Dataset",
              data: [300, 50, 100],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
              ],
              hoverOffset: 4,
            },
          ],
        },
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (canvasEl1.current) {
      const existing = Chart.getChart(canvasEl1.current);
      if (existing) existing.destroy();
      barChartRef.current = new Chart(canvasEl1.current, {
        type: "bar",
        data: {
          labels: [1, 2, 3, 4, 5, 6, 7],
          datasets: [
            {
              label: "Bar Chart",
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: [
                "rgb(227, 106, 131)",
                "rgb(249, 209, 96)",
                "rgb(123, 204, 148)",
                "rgb(130, 211, 207)",
                "rgb(111, 162, 247)",
                "rgb(128, 89, 230)",
                "rgb(80, 80, 80)",
              ],
              borderColor: "gray",
              borderWidth: 1,
            },
          ],
        },
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (canvasEl.current) {
      const existing = Chart.getChart(canvasEl.current);
      if (existing) existing.destroy();
      lineChartRef.current = new Chart(canvasEl.current, {
        type: "line",
        data: {
          labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          datasets: [
            {
              label: "Line Chart",
              data: [2, 0, 9, 0, 6, 0, 0, 3, 3, 16],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
      });
    }
  }, [activeIndex]);

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

            <Box mt={6} flex="1" overflowY="auto">
              {activeIndex === 0 && (
                <Flex flexDirection="column" gap={4}>
                  <Box p={4}>
                    <canvas
                      ref={canvasEl2}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                  <Box p={4}>
                    <canvas
                      ref={canvasEl1}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                  <Box p={4}>
                    <canvas
                      ref={canvasEl}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                </Flex>
              )}
              {activeIndex === 1 && (
                <Box p={4}>
                  <DraggableChartIcon chartType="pie">
                    <canvas
                      ref={canvasEl2}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </DraggableChartIcon>
                </Box>
              )}
              {activeIndex === 2 && (
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
              )}
            </Box>
          </Box>
        </Resizable>
      )}
    </>
  );
};

export default Subbar;
