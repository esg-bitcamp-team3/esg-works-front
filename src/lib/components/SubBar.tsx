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

const items = [
  {
    icon: <GoFileDirectory />,
    titleIcon: <GoFileDirectory size={30} color="#2F6EEA" />,
    title: "전체파일",
  },
  {
    icon: <TfiPieChart />,
    titleIcon: <TfiPieChart size={30} color="#2F6EEA" />,
    title: "파이차트",
  },
  {
    icon: <BsBarChartLine />,
    titleIcon: <BsBarChartLine size={30} color="#2F6EEA" />,
    title: "바차트",
  },
  {
    icon: <RiLineChartLine />,
    titleIcon: <RiLineChartLine size={30} color="#2F6EEA" />,
    title: "라인차트",
  },
  {
    icon: <CiViewTable />,
    titleIcon: <CiViewTable size={30} color="#2F6EEA" />,
    title: "테이블",
  },
];

const Subbar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "star">("all");
  const canvasEl = useRef(null);
  const canvasEl1 = useRef(null);
  const canvasEl2 = useRef(null);

  const pieChartRef = useRef<Chart | null>(null);
  const barChartRef = useRef<Chart | null>(null);
  const lineChartRef = useRef<Chart | null>(null);

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
        right={activeIndex !== null ? "260px" : "0px"}
        top="10"
      >
        <Box
          w="40px"
          h="24vh"
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
            >
              {item.icon}
            </Button>
          ))}
        </Box>
      </Box>

      {activeIndex !== null && (
        <Resizable
          defaultSize={{ width: 260, height: window.innerHeight }}
          minWidth={200}
          maxWidth={500}
          enable={{ left: true }}
          style={{ position: "fixed", right: 0, top: 0, zIndex: 99 }}
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
                {items[activeIndex].titleIcon}
                <Text fontSize="30px" color="#2F6EEA">
                  {items[activeIndex].title}
                </Text>
              </HStack>
              <CloseButton onClick={() => setActiveIndex(null)} />
            </HStack>

            <HStack flexDirection="column" w="100%">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                bg="white"
                borderRadius="md"
                padding="3"
              >
                <Button
                  bg="white"
                  color="black"
                  variant="ghost"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => setSelectedTab("all")}
                >
                  <RxLayout /> <Text ml={2}>전체</Text>
                </Button>
                <Button
                  bg="white"
                  color="black"
                  variant="ghost"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => setSelectedTab("star")}
                >
                  <FaRegStar /> <Text ml={2}>즐겨찾기</Text>
                </Button>
              </Box>
              <Box width="100%" height="4px" display="flex" mt="1">
                <Box
                  flex="1"
                  bg={selectedTab === "all" ? "#2F6EEA" : "gray.200"}
                  borderBottomLeftRadius="md"
                />
                <Box
                  flex="1"
                  bg={selectedTab === "star" ? "#2F6EEA" : "gray.200"}
                  borderBottomRightRadius="md"
                />
              </Box>
            </HStack>

            <Separator borderWidth="1px" color="black" />

            <Box mt={6} flex="1" overflowY="auto">
              {activeIndex === 0 && (
                <Flex flexDirection="column" gap={4}>
                  <Box p={4}>
                    <Text mb={2}>파이차트</Text>
                    <canvas
                      ref={canvasEl2}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                  <Box p={4}>
                    <Text mb={2}>바차트</Text>
                    <canvas
                      ref={canvasEl1}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                  <Box p={4}>
                    <Text mb={2}>라인차트</Text>
                    <canvas
                      ref={canvasEl}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                </Flex>
              )}
              {activeIndex === 1 && (
                <Box p={4}>
                  <Text mb={2}>파이차트</Text>
                  <canvas
                    ref={canvasEl2}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              )}
              {activeIndex === 2 && (
                <Box p={4}>
                  <Text mb={2}>바차트</Text>
                  <canvas
                    ref={canvasEl1}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              )}
              {activeIndex === 3 && (
                <Box p={4}>
                  <Text mb={2}>라인차트</Text>
                  <canvas
                    ref={canvasEl}
                    style={{ width: "100%", height: "100%" }}
                  />
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
