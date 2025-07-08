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
import TableModal from "./modal/TableAddModal";

const items = [
  {
    icon: <IoSearch />,
    titleIcon: <IoSearch size={30} color="#2F6EEA" />,
    title: "데이터 불러오기",
  },
  {
    icon: <LuChartNoAxesCombined />,
    titleIcon: <LuChartNoAxesCombined size={30} color="#2F6EEA" />,
    title: "차트 불러오기",
  },
];

const DEFAULT_SIDEBAR_WIDTH = 550;
const Subbar = ({
  editor,
  isExpanded,
  setIsExpanded,
}: {
  editor: CustomEditor;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<"all" | "star">("all");
  const [chartList, setChartList] = useState<ChartDetail[]>([]);
  const [interestChartList, setInterestChartList] = useState<
    InteresrtChartDetail[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

  const handleStarClick = async (chartId: string) => {
    const isFilled = interestChartList?.some(
      (item) => item.chartId === chartId
    );

    try {
      if (isFilled) {
        // 즐겨찾기 해제
        await deleteInterestChart(chartId);

        // 상태 업데이트 - 즐겨찾기 목록에서 제거
        setInterestChartList((prev) =>
          prev.filter((item) => item.chartId !== chartId)
        );
      } else {
        // 즐겨찾기 추가
        await postInterestChart(chartId);

        fetchChart();
      }
    } catch (e) {
      console.error("⚠️ 관심 차트 상태 변경 중 오류:", e);
      fetchChart();
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
  }, [category]);

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
                setIsExpanded(true);
              }}
            >
              {item.icon}
            </Button>
          ))}
        </Box>

        {isOpen !== false && (
          <Box
            height="100vh"
            width={`${DEFAULT_SIDEBAR_WIDTH}px`}
            padding="5"
            display="flex"
            flexDirection="column"
            overflowY={"auto"}
            style={{
              zIndex: 1000,
              backgroundColor: "white",
            }}
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
                  setIsExpanded(false);
                }}
              />
            </HStack>

            {/* 전체 버튼 */}
            {activeIndex !== 0 && (
              <>
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
                    {activeIndex === 1 && (
                      <ChartModal
                        trigger={
                          <Button
                            size="2xs"
                            p="1"
                            borderRadius="full"
                            bg="#2F6EEA"
                            color="white"
                          >
                            <FaPlus size="12px" />
                          </Button>
                        }
                        onCreate={() => {
                          fetchChart();
                        }}
                      />
                    )}
                  </Box>
                </HStack>
              </>
            )}

            {activeIndex === 0 && <DataTab />}

            {/* 차트 목록 */}
            {activeIndex === 1 && (
              <>
                {selectedTab === "all" && (
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
                        ) : filteredChartList.length === 0 ? (
                          <Text
                            textAlign="center"
                            mt={10}
                            color="gray.500"
                            fontSize="lg"
                          >
                            차트가 없습니다.
                          </Text>
                        ) : (
                          filteredChartList.map((data, index) => {
                            const isFilled =
                              interestChartList?.some(
                                (item) => item.chartId === data.chartId
                              ) ?? false;
                            return (
                              <HStack
                                width={"100%"}
                                key={index}
                                gap={5}
                                alignItems="center"
                                justifyContent="center"
                                alignContent={"center"}
                              >
                                <DraggableChartIcon
                                  chartType={data.type} // 동적으로 타입 전달
                                  data={data}
                                >
                                  <SingleChart chartData={data || []} />
                                </DraggableChartIcon>
                                <StarToggleIcon
                                  filled={isFilled}
                                  onToggle={() => handleStarClick(data.chartId)}
                                />
                              </HStack>
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
                        ) : filteredInterestChartList.length === 0 ? (
                          <Text
                            textAlign="center"
                            mt={10}
                            color="gray.500"
                            fontSize="lg"
                          >
                            차트가 없습니다.
                          </Text>
                        ) : (
                          filteredInterestChartList.map((data, index) => {
                            const isFilled =
                              interestChartList?.some(
                                (item) => item.chartId === data.chartId
                              ) ?? false;
                            return (
                              <HStack
                                width={"100%"}
                                key={index}
                                gap={5}
                                alignItems="center"
                                justifyContent="center"
                                alignContent={"center"}
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
                                  onToggle={() => handleStarClick(data.chartId)}
                                />
                              </HStack>
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
        )}
      </Box>
    </>
  );
};

export default Subbar;
