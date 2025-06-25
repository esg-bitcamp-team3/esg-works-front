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
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
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

const DEFAULT_SIDEBAR_WIDTH = 550;
const Subbar = () => {
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

  useEffect(() => {
    setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
  }, [activeIndex]);

  // 컴포넌트 마운트 시 무조건 실행
  useEffect(() => {
    fetchSection();
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
                setSidebarWidth(sidebarWidth);
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
              width={"100%"}
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
                <HStack w="100%" justifyContent={"space-between"} mt={4}>
                  <Box w={"100%"}>
                    <HStack
                      w="110%"
                      justifyContent="space-around"
                      // alignItems="center"
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
                        gap="3"
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
                          fontWeight={
                            selectedTab === "star" ? "bold" : "normal"
                          }
                        >
                          즐겨찾기
                        </Text>
                      </Button>
                    </HStack>

                    <Box
                      width="110%"
                      height="4px"
                      display="flex"
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
                  </Box>
                  <Box position={"right"}>
                    <ChartModal />
                  </Box>
                </HStack>
              )}

              {activeIndex === 0 && <DataTab />}

              {/* 차트 목록 */}
              {activeIndex === 1 && (
                <>
                  {selectedTab === "all" && (
                    <Box mt={6} flex="1" overflowY="scroll">
                      <Flex
                        flexDirection="column"
                        gap={5}
                        alignContent={"center"}
                      >
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
                                <Flex
                                  key={index}
                                  flexDirection="row"
                                  gap={5}
                                  minH={200}
                                  marginBottom={5}
                                >
                                  <HStack>
                                    <DraggableChartIcon
                                      chartType={"line"} // 동적으로 타입 전달
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
                                </Flex>
                              );
                            })
                          )}
                        </Box>
                      </Flex>
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
            </Box>
          </Resizable>
        )}
      </Box>
    </>
  );
};

export default Subbar;
