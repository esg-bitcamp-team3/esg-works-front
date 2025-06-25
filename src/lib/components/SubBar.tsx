"use client";

import {
  Accordion,
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Input,
  InputGroup,
  Separator,
  Skeleton,
  Dialog,
  Text,
  VStack,
  Table,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
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
  getSearchSectionId,
  getSections,
} from "../api/get";
import { ChartDetail, InteresrtChartDetail } from "../api/interfaces/chart";
import cloneDeep from "lodash/cloneDeep";
// import ChartModal from "./modal/chart-modal";

import {
  PiChartPieSlice,
  PiFolder,
  PiChartDonut,
  PiChartBar,
  PiChartLine,
  PiGridNine,
  PiSquaresFour,
  PiSquaresFourBold,
  PiStar,
  PiStarBold,
  PiStarFill,
} from "react-icons/pi";
import SingleChart from "./chart/SingleChart";
import { deleteInterestChart } from "../api/delete";
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
import { IoSearch } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { Section } from "../interface";
import SubTableContent from "./section/SubTableContent";
import TableModal from "@/lib/components/modal/table-modal";
import Selector from "./gri/Selector";

function normalizeChartData(data) {
  // type 파싱
  let type = "bar";
  if (data.options) {
    try {
      type = JSON.parse(data.options).type;
    } catch {
      // ignore
    }
  } else if (data.chartType) {
    type = data.chartType;
  }
  // ------ 타입별로 변환 ------
  switch (type) {
    case "table":
      // TableChart가 기대하는 구조로!
      return data; // 이미 맞다면
    case "bar":
    case "line":
    case "pie":
    case "doughnut":
      // Chart.js용 구조로 변환
      return {
        labels:
          data.dataSets?.[0]?.esgDataList?.map((item) => item.year) ||
          data.labels ||
          [],
        datasets:
          data.dataSets?.map((dataset) => ({
            label: dataset.label,
            data: dataset.esgDataList.map((item) =>
              typeof item.value === "string" ? Number(item.value) : item.value
            ),
            backgroundColor: dataset.backgroundColor,
            borderColor: dataset.borderColor,
            borderWidth: Number(dataset.borderWidth),
            fill: dataset.fill === "true",
          })) || [],
      };
    default:
      return data; // 그냥 반환
  }
}

const items = [
  {
    icon: <IoSearch />,
    titleIcon: <IoSearch size={30} color="#2F6EEA" />,
    title: "데이터불러오기",
  },
  {
    icon: <LuChartNoAxesCombined />,
    titleIcon: <LuChartNoAxesCombined size={30} color="#2F6EEA" />,
    title: "전체파일",
  },
  {
    icon: <PiGridNine />,
    titleIcon: <PiGridNine size={30} color="#2F6EEA" />,
    title: "테이블",
  },
];

const yearList = [
  { label: "2020년", value: "2020" },
  { label: "2021년", value: "2021" },
  { label: "2022년", value: "2022" },
  { label: "2023년", value: "2023" },
  { label: "2024년", value: "2024" },
  { label: "2025년", value: "2025" },
];
const GRIsectionList = [
  { label: "GRI 200: 경제", value: "200" },
  { label: "GRI 300: 환경", value: "300" },
  { label: "GRI 400: 사회", value: "400" },
];

const Subbar = () => {
  const [activeIndex, setActiveIndex] = useState<number | 0>(0);
  const [selectedTab, setSelectedTab] = useState<"all" | "star">("all");
  const [sidebarWidth, setSidebarWidth] = useState(350); // 👈 수정: 사이드바 너비 상태 추가
  const [chartList, setChartList] = useState<ChartDetail[] | null>([]);
  const [interestChartList, setInterestChartList] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const DEFAULT_SIDEBAR_WIDTH = 350;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [value, setValue] = useState<string>("");
  const [year, setYear] = useState<string>("2020");
  const [category, setCategory] = useState<string>("200");

  // 즐겨 찾기 차트 가져오기
  const fetchChart = async () => {
    setLoading(true);
    try {
      const response = await getChart();
      setChartList(response || []);
      const interestResponse = await getInterestChart();
      setInterestChartList(interestResponse || []);
    } catch (err) {
      setError("차트 데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSection = async (category: string) => {
    try {
      const searchSection = await getSearchSectionId(category);
      setSectionList(searchSection || []);
    } catch (error) {
      console.log("error", error);
    }
  };

  const refreshChart = async () => {
    await fetchChart();
  };

  const refreshSection = async (category: string) => {
    await setCategory(category);
    await fetchSection(category);
  };

  const handleAdd = async (chartId: string) => {
    try {
      await postInterestChart(chartId);
      const updatedInterest = await getInterestChart(); // 전체 관심 차트만 새로 불러오기
      setInterestChartList(updatedInterest || []);
      await refreshChart(); // 기존 로직
    } catch (e) {
      console.error("❌ 관심 차트 등록 중 오류:", e);
    }
  };

  const handleDelete = async (chartId: string) => {
    try {
      await deleteInterestChart(chartId);
      const updatedInterest = await getInterestChart(); // 전체 관심 차트만 새로 불러오기
      setInterestChartList(updatedInterest || []);
      await refreshChart(); // 기존 로직
    } catch (e) {
      console.error("❌ 관심 차트 삭제 중 오류:", e);
    }
  };

  useEffect(() => {
    if (activeIndex === 0) {
      setSidebarWidth(600); // 0일 때 넓게 고정 초기화
    }
  }, [activeIndex]);

  // 컴포넌트 마운트 시 무조건 실행
  useEffect(() => {
    fetchChart();
  }, []);

  // activeIndex가 바뀔 때 실행
  useEffect(() => {
    fetchChart();
  }, [activeIndex]);

  useEffect(() => {
    fetchSection(category);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <Box
          position="fixed"
          right={isOpen ? `${sidebarWidth}px` : "0px"} // isOpen이 true일 때 sidebarWidth만큼 오른쪽으로 이동
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
                }}
                w={"100%"}
              >
                {item.icon}
              </Button>
            ))}
          </Box>
        </Box>

        {isOpen !== false && (
          <Resizable
            defaultSize={{
              width: activeIndex === 0 ? 600 : 350,
              height: window.innerHeight,
            }}
            minWidth={activeIndex === 0 ? 600 : 350}
            maxWidth={activeIndex === 0 ? 1200 : 900}
            enable={{ left: true }}
            onResize={(e, dir, ref) => {
              setSidebarWidth(ref.offsetWidth);
            }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              zIndex: 1000,
              backgroundColor: "white",
              overflowY: "scroll",
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

              {/* 검색창 */}
              <Box>
                <InputGroup
                  startElement={
                    <Box pl="4" display="flex">
                      <FaSearch color="#2F6EEA" />
                    </Box>
                  }
                  alignItems="start"
                  w="100%"
                >
                  <Input
                    flex={1}
                    bg={"white"}
                    borderWidth="1px" // 테두리 두께를 1px로 설정
                    marginX={4}
                  />
                </InputGroup>
                <Box
                  position="absolute"
                  top="100%"
                  mt={1}
                  w="100%"
                  bg="white"
                  border="1px solid #e2e8f0"
                  borderRadius="md"
                  boxShadow="md"
                  zIndex={10}
                  maxH="200px"
                >
                  <VStack gap={0} align="stretch">
                    <Box>
                      <Text></Text>
                    </Box>
                  </VStack>
                </Box>
              </Box>

              {/* 전체 버튼 */}
              {activeIndex !== 0 && (
                <>
                  <HStack
                    w="100%"
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <Button
                      bg="white"
                      onClick={() => setSelectedTab("all")}
                      display="flex"
                      gap="3"
                      alignItems="center"
                      justifyContent="center"
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
                      gap="2"
                      onClick={() => setSelectedTab("star")}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      paddingRight={12}
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
                    {/* 테이블 만들기 */}
                    <div>
                      <TableModal />
                    </div>
                  </HStack>

                  <Box
                    width="100%"
                    height="4px"
                    display="flex"
                    // mt="2"
                    borderRadius="md"
                    overflow="auto"
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
                </>
              )}

              {activeIndex === 0 && (
                <>
                  <Box w="100%" pt={4} pb={4}>
                    <HStack spaceX={6} align="center" justify="space-between">
                      <Selector
                        items={GRIsectionList}
                        text="GRI Standards"
                        selected={(value) => {
                          setCategory(value);
                          refreshSection(value);
                        }}
                        width="100%"
                      />
                      <Selector
                        items={yearList}
                        text="연도"
                        selected={(value) => setYear(value)}
                        width="100%"
                      />
                    </HStack>
                  </Box>
                </>
              )}

              {/* Section 기준 항목 */}
              {activeIndex === 0 && (
                <>
                  <Accordion.Root
                    collapsible
                    width="100%"
                    value={[value]}
                    onValueChange={(e) => setValue(e.value[0] || "")}
                  >
                    {sectionList.map((item, index) => (
                      <Accordion.Item
                        key={index}
                        value={item.sectionId}
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="lg"
                        mb={4}
                        overflow="hidden"
                        _hover={{ borderColor: "blue.200" }}
                        transition="all 0.2s ease"
                      >
                        <Accordion.ItemTrigger
                          p={6}
                          bg="white"
                          _hover={{ bg: "blue.50" }}
                          _expanded={{
                            bg: "blue.50",
                            borderBottomWidth: "1px",
                            borderColor: "gray.200",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                        >
                          <Text
                            textStyle={"md"}
                            fontWeight="bold"
                            color="gray.700"
                          >
                            {item.sectionId + " : " + item.sectionName}
                          </Text>

                          <Accordion.ItemIndicator colorPalette="blue" />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                          <Box p={6} bg="white">
                            {
                              <SubTableContent
                                no={item.sectionId}
                                year={year}
                              />
                            }
                          </Box>
                        </Accordion.ItemContent>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </>
              )}

              {/* 차트 목록 */}
              {activeIndex === 1 && (
                <>
                  {selectedTab === "all" && (
                    <Box mt={6} flex="1" overflowY="auto">
                      <Flex flexDirection="column" gap={5}>
                        <Box py={4}>
                          {loading ? (
                            Array(2)
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
                                  minH={200}
                                  marginBottom={5}
                                >
                                  <DraggableChartIcon
                                    chartType={JSON.parse(data.options).type}
                                    data={normalizeChartData(data)}
                                  >
                                    <SingleChart chartData={data || []} />
                                  </DraggableChartIcon>
                                  <StarToggleIcon
                                    filled={isFilled}
                                    onToggle={async (filled) => {
                                      if (filled) {
                                        try {
                                          await handleAdd(data.chartId);
                                          console.log(
                                            `${data.chartId} 차트가 관심 차트로 등록되었습니다.`,
                                            "⭐ 관심 차트로 등록되었습니다."
                                          );
                                        } catch (e) {
                                          console.error(
                                            "❌ 관심 차트 등록 실패:",
                                            e
                                          );
                                        }
                                      } else {
                                        try {
                                          await handleDelete(data.chartId);
                                          console.log("💔 관심 차트 해제됨");
                                        } catch (e) {
                                          console.error(
                                            "❌ 관심 차트 해제 실패:",
                                            e
                                          );
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
                          ) : interestChartList &&
                            interestChartList.length === 0 ? (
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
                                  marginBottom={5}
                                >
                                  {/* <DraggableChartIcon
                                    chartType={JSON.parse(data.options).type}
                                    data={normalizeChartData(data)}
                                  >
                                    <SingleChart chartData={data || []} />
                                  </DraggableChartIcon> */}
                                  <DraggableChartIcon
                                    chartType={"line"} // 동적으로 타입 전달
                                    data={data.chartDetail}
                                  >
                                    <SingleChart
                                      chartData={data.chartDetail || []}
                                    />
                                  </DraggableChartIcon>
                                  <StarToggleIcon
                                    filled={isFilled}
                                    onToggle={async (filled) => {
                                      if (filled) {
                                        try {
                                          await handleAdd(data.chartId);
                                          console.log(
                                            `${data.chartId} 차트가 관심 차트로 등록되었습니다.`,
                                            "⭐ 관심 차트로 등록되었습니다."
                                          );
                                        } catch (e) {
                                          console.error(
                                            "❌ 관심 차트 등록 실패:",
                                            e
                                          );
                                        }
                                      } else {
                                        try {
                                          await handleDelete(data.chartId);
                                          console.log("💔 관심 차트 해제됨");
                                        } catch (e) {
                                          console.error(
                                            "❌ 관심 차트 해제 실패:",
                                            e
                                          );
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
                </>
              )}

              {/* 테이블 목록 */}
              {activeIndex === 2 && (
                <>
                  {selectedTab === "all" && (
                    <Box mt={6} flex="1" overflowY="auto">
                      <Flex flexDirection="column" gap={5}>
                        <Box py={4}>
                          {loading ? (
                            Array(2)
                              .fill(0)
                              .map((_, index) => (
                                <Skeleton
                                  key={index}
                                  height="150px"
                                  mb={4}
                                  borderRadius="md"
                                />
                              ))
                          ) : chartList &&
                            chartList.filter(
                              (chart) =>
                                chart.options &&
                                JSON.parse(chart.options).type === "table"
                            ).length === 0 ? (
                            <Text
                              textAlign="center"
                              mt={10}
                              color="gray.500"
                              fontSize="lg"
                            >
                              테이블이 없습니다.
                            </Text>
                          ) : (
                            chartList &&
                            chartList
                              .filter(
                                (chart) =>
                                  chart.options &&
                                  JSON.parse(chart.options).type === "table"
                              )
                              .map((data, index) => {
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
                                    marginBottom={5}
                                  >
                                    <DraggableChartIcon
                                      chartType={JSON.parse(data.options).type}
                                      data={normalizeChartData(data)}
                                    >
                                      <SingleChart chartData={data || []} />
                                    </DraggableChartIcon>
                                    <StarToggleIcon
                                      filled={isFilled}
                                      onToggle={async (filled) => {
                                        if (filled) {
                                          try {
                                            await handleAdd(data.chartId);
                                            console.log(
                                              `${data.chartId} 차트가 관심 차트로 등록되었습니다.`,
                                              "⭐ 관심 차트로 등록되었습니다."
                                            );
                                          } catch (e) {
                                            console.error(
                                              "❌ 관심 차트 등록 실패:",
                                              e
                                            );
                                          }
                                        } else {
                                          try {
                                            await handleDelete(data.chartId);
                                            console.log("💔 관심 차트 해제됨");
                                          } catch (e) {
                                            console.error(
                                              "❌ 관심 차트 해제 실패:",
                                              e
                                            );
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
                          ) : interestChartList &&
                            interestChartList.length === 0 ? (
                            <Text
                              textAlign="center"
                              mt={10}
                              color="gray.500"
                              fontSize="lg"
                            >
                              테이블이 없습니다.
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
                                  marginBottom={5}
                                >
                                  <DraggableChartIcon
                                    chartType={"line"} // 동적으로 타입 전달
                                    data={data.chartDetail}
                                  >
                                    <SingleChart
                                      chartData={data.chartDetail || []}
                                    />
                                  </DraggableChartIcon>
                                  <StarToggleIcon
                                    filled={isFilled}
                                    onToggle={async (filled) => {
                                      if (filled) {
                                        try {
                                          await handleAdd(data.chartId);
                                          console.log(
                                            `${data.chartId} 차트가 관심 차트로 등록되었습니다.`,
                                            "⭐ 관심 차트로 등록되었습니다."
                                          );
                                        } catch (e) {
                                          console.error(
                                            "❌ 관심 차트 등록 실패:",
                                            e
                                          );
                                        }
                                      } else {
                                        try {
                                          await handleDelete(data.chartId);
                                          console.log("💔 관심 차트 해제됨");
                                        } catch (e) {
                                          console.error(
                                            "❌ 관심 차트 해제 실패:",
                                            e
                                          );
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
                </>
              )}
            </Box>
          </Resizable>
        )}
      </>
    </DndProvider>
  );
};

export default Subbar;
