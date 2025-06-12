"use client";

import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Separator,
  Skeleton,
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
  PiStarFill,
  PiChartDonut,
} from "react-icons/pi";
import SingleChart from "./chart/SingleChart";
import { deleteInterestChart } from "../api/delete";
import StarIcon from "../editor/components/StarIcon";
import StarToggleIcon from "../editor/components/StarIcon";
import { postInterestChart } from "../api/post";
import { LuChartNoAxesCombined } from "react-icons/lu";
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
    type: "all",
  },
  {
    icon: <PiChartPieSlice />,
    titleIcon: <PiChartPieSlice size={30} color="#2F6EEA" />,
    title: "파이그래프",
    type: "pie",
  },
  {
    icon: <PiChartDonut />,
    titleIcon: <PiChartDonut size={30} color="#2F6EEA" />,
    title: "도넛그래프",
    type: "doughnut",
  },
  {
    icon: <PiChartBar />,
    titleIcon: <PiChartBar size={30} color="#2F6EEA" />,
    title: "막대그래프",
    type: "bar",
  },
  {
    icon: <PiChartLine />,
    titleIcon: <PiChartLine size={30} color="#2F6EEA" />,
    title: "꺾은선그래프",
    type: "line",
  },
  {
    icon: <LuChartNoAxesCombined />,
    titleIcon: <LuChartNoAxesCombined size={30} color="#2F6EEA" />,
    title: "혼합그래프",
    type: "line",
  },
  {
    icon: <PiGridNine />,
    titleIcon: <PiGridNine size={30} color="#2F6EEA" />,
    title: "표",
    type: "table",
  },
];

const Subbar = () => {
  const [activeIndex, setActiveIndex] = useState<number | 0>(0);
  const [selectedTab, setSelectedTab] = useState<"all" | "star">("all");
  const [sidebarWidth, setSidebarWidth] = useState(350); // 👈 수정: 사이드바 너비 상태 추가
  const [chartList, setChartList] = useState<ChartDetail[] | null>([]);
  const [interestChartList, setInterestChartList] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [isOpne, setIsOpen] = useState(false);
  const [type, setType] = useState<string>("pie");
  const DEFAULT_SIDEBAR_WIDTH = 350;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 즐겨 찾기 차트 가져오기
  const fetchChart = async (chartType?: string) => {
    setLoading(true);
    try {
      const response = chartType
        ? await getChartByType(chartType)
        : await getChart();
      setChartList(response || []);
      const interestResponse = chartType
        ? await getInterestChartByType(chartType)
        : await getInterestChart();
      setInterestChartList(interestResponse || []);
    } catch (err) {
      setError("차트 데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const refreshChart = async (chartType?: string) => {
    await fetchChart(chartType);
  };

  const handleAdd = async (chartId: string, chartType?: string) => {
    try {
      await postInterestChart(chartId);

      if (chartType === "all") {
        const updatedInterest = await getInterestChart(); // 전체 관심 차트만 새로 불러오기
        setInterestChartList(updatedInterest || []);
      } else {
        await refreshChart(chartType); // 기존 로직
      }
    } catch (e) {
      console.error("❌ 관심 차트 등록 중 오류:", e);
    }
  };

  const handleDelete = async (chartId: string, chartType?: string) => {
    try {
      await deleteInterestChart(chartId);

      if (chartType === "all") {
        const updatedInterest = await getInterestChart(); // 전체 관심 차트만 새로 불러오기
        setInterestChartList(updatedInterest || []);
      } else {
        await refreshChart(chartType); // 기존 로직
      }
    } catch (e) {
      console.error("❌ 관심 차트 삭제 중 오류:", e);
    }
  };

  useEffect(() => {
    fetchChart(
      items[activeIndex]?.type === "all" ? undefined : items[activeIndex]?.type
    );
  }, [activeIndex]);

  return (
    <>
      <Box
        position="fixed"
        right={isOpne === true ? `${sidebarWidth}px` : "0px"} // ❗사이드바 너비에 따라 이동
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
              onClick={() => {
                setActiveIndex(idx);
                setIsOpen(true);
                setType(item.type || "pie");
              }}
              w={"100%"}
            >
              {item.icon}
            </Button>
          ))}
        </Box>
      </Box>

      {isOpne !== false && (
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
                  setIsOpen(false);
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
                <Flex flexDirection="column" gap={5}>
                  <Box py={4}>
                    {loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            height="150px"
                            mb={4}
                            borderRadius="md"
                          />
                        ))
                    ) : chartList && chartList.length === 0 ? (
                      <Text
                        textAlign="center"
                        mt={10}
                        color="gray.500"
                        fontSize="lg"
                      >
                        차트가 없습니다.
                      </Text>
                    ) : (
                      chartList &&
                      chartList.map((data, index) => {
                        const isFilled =
                          interestChartList?.some(
                            (item) => item.chartId === data.chartId
                          ) ?? false;
                        return (
                          <Flex
                            key={index}
                            flexDirection="row"
                            gap={5}
                            marginBottom={5}
                          >
                            <DraggableChartIcon
                              chartType={
                                activeIndex === 0
                                  ? data.dataSets[0].type
                                  : items[activeIndex].type
                              } // 동적으로 타입 전달
                              data={data}
                            >
                              <SingleChart chartData={data || []} />
                            </DraggableChartIcon>
                            <StarToggleIcon
                              filled={isFilled}
                              onToggle={async (filled) => {
                                if (filled) {
                                  try {
                                    await handleAdd(
                                      data.chartId,
                                      items[activeIndex].type
                                    );
                                    console.log(
                                      `${data.chartId} 차트가 관심 차트로 등록되었습니다.`,
                                      "⭐ 관심 차트로 등록되었습니다."
                                    );
                                  } catch (e) {
                                    console.error("❌ 관심 차트 등록 실패:", e);
                                  }
                                } else {
                                  try {
                                    await handleDelete(
                                      data.chartId,
                                      items[activeIndex].type
                                    );
                                    console.log("💔 관심 차트 해제됨");
                                  } catch (e) {
                                    console.error("❌ 관심 차트 해제 실패:", e);
                                  }
                                }
                              }}
                            />
                          </Flex>
                        );
                      })
                    )}
                  </Box>
                </Flex>
              </Box>
            )}

            {selectedTab === "star" && (
              <Box mt={6} flex="1" overflowY="auto">
                <Flex flexDirection="column" gap={4}>
                  <Box p={4}>
                    {loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <Skeleton
                            key={index}
                            height="150px"
                            mb={4}
                            borderRadius="md"
                          />
                        ))
                    ) : chartList && chartList.length === 0 ? (
                      <Text
                        textAlign="center"
                        mt={10}
                        color="gray.500"
                        fontSize="lg"
                      >
                        차트가 없습니다.
                      </Text>
                    ) : (
                      interestChartList &&
                      interestChartList.map((data, index) => {
                        const isFilled =
                          interestChartList?.some(
                            (item) => item.chartId === data.chartId
                          ) ?? false;
                        return (
                          <Flex
                            key={index}
                            flexDirection="row"
                            gap={5}
                            minH={200}
                          >
                            <DraggableChartIcon
                              chartType={
                                activeIndex === 0
                                  ? data.chartDetail.dataSets[0].type
                                  : items[activeIndex].type
                              } // 동적으로 타입 전달
                              data={data.chartDetail}
                            >
                              <SingleChart chartData={data.chartDetail || []} />
                            </DraggableChartIcon>
                            <StarToggleIcon
                              filled={isFilled}
                              onToggle={async (filled) => {
                                if (filled) {
                                  try {
                                    await handleAdd(
                                      data.chartId,
                                      items[activeIndex].type
                                    );
                                    console.log(
                                      `${data.chartId} 차트가 관심 차트로 등록되었습니다.`,
                                      "⭐ 관심 차트로 등록되었습니다."
                                    );
                                  } catch (e) {
                                    console.error("❌ 관심 차트 등록 실패:", e);
                                  }
                                } else {
                                  try {
                                    await handleDelete(
                                      data.chartId,
                                      items[activeIndex].type
                                    );
                                    console.log("💔 관심 차트 해제됨");
                                  } catch (e) {
                                    console.error("❌ 관심 차트 해제 실패:", e);
                                  }
                                }
                              }}
                            />
                          </Flex>
                        );
                      })
                    )}
                  </Box>
                </Flex>
              </Box>
            )}
          </Box>
        </Resizable>
      )}
    </>
  );
};

export default Subbar;
