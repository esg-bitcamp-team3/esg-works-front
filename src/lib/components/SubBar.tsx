"use client";

import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Input,
  InputGroup,
  Skeleton,
  Dialog,
  Text,
  Table,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Resizable } from "re-resizable";
import DraggableChartIcon from "./DraggableChartIcon";
import { getChart, getInterestChart, getSearchSectionId } from "../api/get";
import { ChartDetail, InteresrtChartDetail } from "../api/interfaces/chart";

import {
  PiGridNine,
  PiSquaresFour,
  PiSquaresFourBold,
  PiStar,
  PiStarBold,
} from "react-icons/pi";
import SingleChart from "./chart/SingleChart";
import { deleteInterestChart } from "../api/delete";
import StarToggleIcon from "../editor/components/StarIcon";
import { postInterestChart } from "../api/post";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { Section } from "../interface";
import DataTab from "./section/DataTab";
import ChartModal from "./modal/chart-modal";
import TableAddModal from "./modal/TableAddModal";
import { CustomEditor } from "../editor/custom-types";

const items = [
  {
    icon: <IoSearch />,
    titleIcon: <IoSearch size={30} color="#2F6EEA" />,
    title: "데이터불러오기",
  },
  {
    icon: <LuChartNoAxesCombined />,
    titleIcon: <LuChartNoAxesCombined size={30} color="#2F6EEA" />,
    title: "차트",
  },
  {
    icon: <PiGridNine />,
    titleIcon: <PiGridNine size={30} color="#2F6EEA" />,
    title: "테이블",
  },
];

const DEFAULT_SIDEBAR_WIDTH = 550;
const Subbar = ({ editor }: { editor: CustomEditor }) => {
  const [activeIndex, setActiveIndex] = useState<number | 0>(0);
  const [selectedTab, setSelectedTab] = useState<"all" | "star">("all");
  const [sidebarWidth, setSidebarWidth] = useState(550); // 👈 수정: 사이드바 너비 상태 추가
  const [chartList, setChartList] = useState<ChartDetail[] | null>([]);
  const [interestChartList, setInterestChartList] = useState<
    InteresrtChartDetail[] | null
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [category, setCategory] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 즐겨 찾기 차트 가져오기
  const fetchChart = async () => {
    setLoading(true);
    try {
      const response = await getChart();
      console.log("Chart data:", response);
      setChartList(response || []);
      const interestResponse = await getInterestChart();
      setInterestChartList(interestResponse || []);
    } catch (err) {
      setError("차트 데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSection = async (category?: string) => {
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

  // 차트 검색 기능
  const filteredChartList = chartList?.filter((chart) =>
    chart.chartName?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const filteredInterestChartList = interestChartList?.filter((chart) =>
    chart.chartDetail?.chartName
      ?.toLowerCase()
      .includes(searchKeyword.toLowerCase())
  );

  // 컴포넌트 마운트 시 무조건 실행
  useEffect(() => {
    fetchSection();
    fetchChart();
  }, []);

  useEffect(() => {
    fetchSection(category);
  }, []);
  return (
    <>
      {/* Sidebar Toggle */}
      <Box
        position="fixed"
        right={0}
        top={0}
        zIndex={1000}
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
      >
        {/* 버튼 박스 */}
        <Box
          w="40px"
          h="30vh"
          bg="white"
          borderRadius="xl"
          display="flex"
          flexDir="column"
          justifyContent="center"
          borderRight="1px solid #eee"
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
            >
              {item.icon}
            </Button>
          ))}
        </Box>

        {isOpen !== false && (
          <Resizable
            // minWidth={DEFAULT_SIDEBAR_WIDTH}
            maxWidth={900}
            enable={{ left: true }}
            onResize={(e, dir, ref) => {
              setSidebarWidth(ref.offsetWidth);
            }}
            style={{
              zIndex: 1000,
              backgroundColor: "white",
            }}
          >
            <Box
              height="100vh"
              width={sidebarWidth}
              padding="5"
              display="flex"
              flexDirection="column"
              overflowY={"auto"}
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

              {/* 기준 검색 */}
              <Box>
                <InputGroup
                  startElement={
                    <Box display="flex">
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
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </InputGroup>
              </Box>

              {/* 전체 버튼 */}
              {activeIndex !== 0 && (
                <HStack
                  w="100%"
                  justifyContent={"space-between"}
                  mt={4}
                  gap={4}
                >
                  <Box w={"100%"}>
                    <HStack
                      w="100%"
                      justifyContent="space-around"
                      alignItems="center"
                    >
                      <Button
                        bg="white"
                        onClick={() => setSelectedTab("all")}
                        display="flex"
                        gap="2"
                      >
                        {selectedTab === "all" ? (
                          <PiSquaresFour color="#2F6EEA" size="12px" />
                        ) : (
                          <PiSquaresFour color="gray" size="12px" />
                        )}
                        <Text
                          fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                          color={selectedTab === "all" ? "#2F6EEA" : "gray"}
                          fontWeight={selectedTab === "all" ? "bold" : "normal"}
                          alignItems="center"
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
                      >
                        {selectedTab === "star" ? (
                          <PiStarBold color="#2F6EEA" size="12px" />
                        ) : (
                          <PiStar color="gray" size="12px" />
                        )}
                        <Text
                          fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                          color={selectedTab === "star" ? "#2F6EEA" : "gray"}
                          fontWeight={
                            selectedTab === "star" ? "bold" : "normal"
                          }
                        >
                          즐겨찾기
                        </Text>
                      </Button>
                    </HStack>

                    <Box
                      width="100%"
                      height="3px"
                      display="flex"
                      borderRadius="md"
                      overflow="auto"
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
                  </Box>
                  <Box position={"right"}>
                    {activeIndex === 1 && <ChartModal />}
                    {activeIndex === 2 && <TableAddModal editor={editor} />}
                  </Box>
                </HStack>
              )}

              {activeIndex === 0 && <DataTab />}

              {/* 차트 목록 */}
              {activeIndex === 1 && (
                <>
                  {selectedTab === "all" && (
                    <Box mt={6} flex="1" overflowY="scroll">
                      <VStack
                        py={4}
                        gap={4}
                        widows={"100%"}
                        alignItems="center"
                      >
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
                        ) : filteredChartList &&
                          filteredChartList.length === 0 ? (
                          <Text
                            textAlign="center"
                            mt={10}
                            color="gray.500"
                            fontSize="lg"
                          >
                            차트가 없습니다.
                          </Text>
                        ) : (
                          filteredChartList &&
                          filteredChartList.map((data, index) => {
                            const isFilled =
                              interestChartList?.some(
                                (item) => item.chartId === data.chartId
                              ) ?? false;
                            return (
                              <HStack width={"100%"} key={index} gap={5}>
                                <DraggableChartIcon
                                  chartType={data.type} // 동적으로 타입 전달
                                  data={data}
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
                              </HStack>
                            );
                          })
                        )}
                      </VStack>
                    </Box>
                  )}

                  {selectedTab === "star" && (
                    <Box mt={6} flex="1" overflowY="scroll">
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
                          ) : filteredInterestChartList &&
                            filteredInterestChartList.length === 0 ? (
                            <Text
                              textAlign="center"
                              mt={10}
                              color="gray.500"
                              fontSize="lg"
                            >
                              차트가 없습니다.
                            </Text>
                          ) : (
                            filteredInterestChartList &&
                            filteredInterestChartList.map((data, index) => {
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
                                      chartType={"table"} // 동적으로 타입 전달
                                      data={data}
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
      </Box>
    </>
  );
};

export default Subbar;
