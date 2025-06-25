"use client";

import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  CloseButton,
  Dialog,
  Portal,
  Select,
  createListCollection,
  InputGroup,
  Checkbox,
  Tabs,
} from "@chakra-ui/react";
import { FaPen, FaSearch, FaChartPie, FaTable, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import TableContent from "./TableContent";
import { CategoryDetail, Section } from "@/lib/api/interfaces/categoryDetail";
import { getSectionsByCriterion } from "@/lib/api/get";

import {
  ChartType,
  DataSet,
  InputChart,
  InputDataSet,
} from "@/lib/api/interfaces/chart";
import {
  getSections,
  getCategories,
  getEsgData,
  getCriterion,
} from "@/lib/api/get";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";
import ChartContent from "./ChartContent";
import MoveToTableButton from "./MoveToTableButton";
import TabContent from "./TabContent";
import MoveToChartButton from "./MoveToChartButton";
import ContentBox from "./ContentBox";
import { CategoryScale, ChartData, ChartOptions } from "chart.js";
import { postChart, postDataSet } from "@/lib/api/post";
import { RiResetLeftFill } from "react-icons/ri";
import { Criterion } from "@/lib/interface";

const chartType: ChartType[] = [
  { type: "bar", label: "막대 차트", icons: FaChartPie },
  { type: "line", label: "선 차트", icons: FaPen },
  { type: "pie", label: "파이 차트", icons: FaChartPie },
  { type: "doughnut", label: "도넛 차트", icons: FaChartPie },
  { type: "mixed", label: "믹스 차트", icons: FaTable },
];

export default function ChartModal() {
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTab, setSelectedTab] = useState<string>("chart");
  const [criterion, setCriterion] = useState<Criterion[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [selectedCriterionId, setSelectedCriterionId] = useState<
    string | null
  >();
  const [allCategories, setAllCategories] = useState<CategoryDetail[]>([]);
  // criterion에 속한 모든 section의 모든 category를 담는 state
  const [criterionCategories, setCriterionCategories] = useState<
    CategoryDetail[]
  >([]);
  const [categorizedEsgDataList, setCategorizedEsgDataList] = useState<
    CategorizedESGDataList[]
  >([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [options, setOptions] = useState<ChartOptions>({});

  const createChartWithDataSets = async (
    options: ChartOptions,
    chartData: ChartData,
    categorizedEsgDataList: CategorizedESGDataList[]
  ) => {
    try {
      // 1. 차트 생성
      const chartName = String(options.plugins?.title?.text ?? "제목 없음");
      const optionsString = JSON.stringify(options);
      const newChart: InputChart = {
        chartName,
        options: optionsString,
      };

      const result = await postChart(newChart);
      const chartId = result?.chartId;

      if (!chartId) {
        console.error("chartId를 받지 못했습니다.", result);
        return;
      }

      console.log("생성된 chartId:", chartId);

      // 2. 데이터셋 생성
      for (const item of chartData.datasets) {
        const sortedEsgDataList = [
          ...categorizedEsgDataList[0].esgNumberDTOList,
        ].sort((a, b) => {
          // 연도 기준 오름차순 정렬 (year이 string이라면 숫자로 변환 후 비교)
          return Number(a.year) - Number(b.year);
        });

        const newDataSet: InputDataSet = {
          chartId,
          type: item.type ?? "bar",
          label: item.label ?? "",
          esgDataIdList: sortedEsgDataList.map((esg) => esg.esgDataId),
          backgroundColor:
            typeof item.backgroundColor === "string"
              ? item.backgroundColor
              : "#36A2EB", // 기본값 설정
          borderColor:
            typeof item.borderColor === "string" ? item.borderColor : "#000000",
          borderWidth:
            item.borderWidth != null ? String(item.borderWidth) : "1",
          fill: typeof item.stack === "boolean" ? item.stack : false,
        };

        await postDataSet(newDataSet);
      }

      console.log("Chart와 모든 DataSet 생성 완료");
    } catch (error) {
      console.error("Chart 또는 DataSet 생성 실패:", error);
    }
  };

  useEffect(() => {
    const fetchCriterion = async () => {
      try {
        const criterion = await getCriterion();
        console.log("Fetched criterion:", criterion);
        setCriterion(criterion);
      } catch (error) {
        console.error("평가 기준 가져오기 실패:", error);
        setCriterion([]);
      }
    };
    fetchCriterion();
  });

  const criteria = createListCollection({
    items: criterion
      .filter((c) => c.criterionId && c.criterionName)
      .map((c) => ({
        label: c.criterionName,
        value: c.criterionId,
      })),
  });

  // criterionId가 변경될 때만 section을 불러오고, 초기화도 여기에 포함
  useEffect(() => {
    if (!selectedCriterionId) {
      setSections([]);
      setSelectedSectionId(null);
      setCategories([]);
      return;
    }
    const fetchSections = async () => {
      const response = await getSectionsByCriterion(selectedCriterionId);
      setSections(response);
      setSelectedSectionId(null);
      setCategories([]);
    };
    fetchSections();
  }, [selectedCriterionId]);

  // useEffect(() => {
  //   const fetchSections = async () => {
  //     try {
  //       const sections = await getSections();
  //       console.log("Fetched sections:", sections);
  //       setSections(sections);
  //     } catch (error) {
  //       console.error("섹션 가져오기 실패:", error);
  //       setSections([]); // Set to empty array on error
  //     }
  //   };
  //   fetchSections();
  // }, []);

  // 최초 렌더링 시 전체 카테고리 가져오기Add commentMore actions
  // useEffect(() => {
  //   const fetchAllCategories = async () => {
  //     const all = await getCategories();
  //     setAllCategories(all);
  //   };
  //   fetchAllCategories();
  // }, []);

  // 섹션 목록 가져오기
  useEffect(() => {
    const fetchSections = async () => {
      const secs = await getSections();
      setSections(secs);
    };
    fetchSections();
  }, []);

  // Section이 선택된 경우: 해당 section의 카테고리만 fetch
  useEffect(() => {
    if (!selectedSectionId) {
      setCategories([]);
      return;
    }
    const fetchCategories = async () => {
      const data = await getCategories(selectedSectionId);
      setCategories(data);
    };
    fetchCategories();
  }, [selectedSectionId]);

  // Criterion만 선택된 경우: criterion에 속한 모든 section의 모든 category를 fetch & 합침
  useEffect(() => {
    // section이 선택된 경우에는 동작하지 않음
    if (!selectedCriterionId || selectedSectionId) {
      setCriterionCategories([]);
      return;
    }
    const fetchAllCategoriesInCriterion = async () => {
      // criterion에 속한 모든 section id를 불러와서, 각 섹션의 카테고리 fetch 후 합침
      const secs = await getSectionsByCriterion(selectedCriterionId);
      if (!secs || secs.length === 0) {
        setCriterionCategories([]);
        return;
      }
      // 모든 section의 카테고리 fetch
      const all = await Promise.all(
        secs.map((sec) => getCategories(sec.sectionId))
      );
      // 2차원 배열을 1차원으로 평탄화
      const flat = all.flat();
      setCriterionCategories(flat);
    };
    fetchAllCategoriesInCriterion();
  }, [selectedCriterionId, selectedSectionId]);

  // 선택된 criterionId에 해당하는 section만 표시
  const gristandards = createListCollection({
    items: sections
      .filter((section) => section.sectionId && section.sectionName)
      .map((section) => ({
        label: section.sectionName,
        value: section.sectionId,
      })),
  });

  const getData = async () => {
    setDataLoading(true);
    Promise.all(selected.map((id) => getEsgData(id)))
      .then((results) => {
        const validResults = results.filter(
          (result): result is CategorizedESGDataList => result !== null
        );
        setCategorizedEsgDataList(validResults);
      })
      .catch((error) => {
        console.error("Error fetching ESG data:", error);
      })
      .finally(() => {
        setDataLoading(false);
      });
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  // 표시할 카테고리 배열 분기
  // section이 선택된 경우: 해당 section의 카테고리만, section 미선택 시 criterion 내 모든 section의 모든 category
  let displayedCategories: CategoryDetail[] = [];
  if (selectedCriterionId && selectedSectionId) {
    displayedCategories = categories;
  } else if (selectedCriterionId && !selectedSectionId) {
    displayedCategories = criterionCategories;
  } else {
    displayedCategories = [];
  }

  useEffect(() => {
    if (selected.length > 0) {
      getData();
    }
  }, [selected]);

  return (
    <Dialog.Root placement="center" motionPreset="scale" size="lg">
      <Dialog.Trigger asChild>
        <Button
          size="2xs"
          p="1"
          borderRadius="full"
          bg="#2F6EEA"
          color="white"
          // position="fixed"
          // top="4"
          // right="4"
        >
          <FaPlus size="sm" />
        </Button>
      </Dialog.Trigger>

      {/* 모달창 =================================================== */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            height={{
              base: "90vh",
              sm: "85vh",
              md: "75vh",
              lg: "85vh",
            }}
            width={{ base: "95%", sm: "85%", md: "60vw", lg: "60vw" }}
            maxW="100%"
            display="flex"
            transition="all 0.3s ease-in-out"
          >
            <Dialog.Header>
              <Dialog.Title
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color="#2F6EEA"
              >
                새 차트 생성
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body flex="1" overflowY="hidden">
              {/* 처음 페이지 ================================= */}
              {step === 1 && (
                <Flex
                  direction="column"
                  alignItems="center"
                  width="100%"
                  gap="4"
                >
                  {/* 상단 검색 영역 */}
                  <Flex
                    flexDirection={{ base: "column", md: "row" }}
                    alignItems={{ base: "stretch", md: "center" }}
                    justifyContent="flex-start"
                    width="100%"
                    gap={4}
                  >
                    {/* Criterion Select ============================================== */}
                    <Select.Root
                      collection={criteria}
                      h="100%"
                      w="100%"
                      flex={{ base: "1", md: "1", lg: "1" }}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText
                            paddingLeft="2"
                            paddingRight="2"
                            placeholder="평가 기준"
                            fontSize={{ base: "sm", md: "md", lg: "md" }}
                          />
                        </Select.Trigger>
                        <Select.IndicatorGroup paddingRight="2">
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>

                      <Select.Positioner>
                        <Select.Content p={2}>
                          {criteria.items.map((criteria) => (
                            <Select.Item
                              item={criteria}
                              key={criteria.value}
                              onClick={() => {
                                // criterion 선택 시 criterionId를 설정하고 sectionId는 초기화
                                setSelectedCriterionId(criteria.value || null);
                                setSelectedSectionId(null);
                              }}
                              paddingLeft="2"
                              paddingRight="2"
                              paddingY={2}
                              rounded="md"
                              fontSize={{ base: "sm", md: "md", lg: "md" }}
                              justifyContent={"space-between"}
                            >
                              {criteria.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                    {/* Section Select ============================================== */}
                    <Select.Root
                      collection={gristandards}
                      disabled={!selectedCriterionId}
                      h="100%"
                      w="100%"
                      flex={{ base: "1", md: "1", lg: "1" }}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText
                            paddingLeft="2"
                            paddingRight="2"
                            placeholder="세부 평가"
                            fontSize={{ base: "sm", md: "md", lg: "md" }}
                          />
                        </Select.Trigger>
                        <Select.IndicatorGroup paddingRight="2">
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>

                      <Select.Positioner>
                        <Select.Content p={2}>
                          {gristandards.items.map((gristandard) => (
                            <Select.Item
                              item={gristandard}
                              key={gristandard.value}
                              onClick={() => {
                                console.log(
                                  "📌 선택된 섹션 ID:",
                                  gristandard.value
                                );
                                setSelectedSectionId(gristandard.value || null);
                              }}
                              paddingLeft="2"
                              paddingRight="2"
                              paddingY={2}
                              rounded="md"
                              fontSize={{ base: "sm", md: "md", lg: "md" }}
                              justifyContent={"space-between"}
                            >
                              {gristandard.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>

                    {/* 검색 */}
                    <InputGroup
                      startElement={
                        <Box paddingLeft="3" display="flex" alignItems="center">
                          <FaSearch />
                        </Box>
                      }
                      alignItems="start"
                      width={{ base: "100%", md: "60%" }}
                      flex={{ base: "1", md: "2", lg: "3" }}
                    >
                      <Input
                        placeholder="검색"
                        fontSize="md"
                        w="100%"
                        value={searchTerm}
                        disabled={!selectedCriterionId}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Flex>

                  {/* 체크박스 목록 영역 */}
                  <Box
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    gap="2"
                    borderRadius="md"
                    borderWidth="1px"
                    width="100%"
                    minHeight={{ base: "45vh", md: "35vh", lg: "45vh" }}
                    maxHeight={{ base: "50vh", md: "40vh", lg: "45vh" }}
                    padding="4"
                    overflowY="auto"
                  >
                    {/* {displayedCategories
                      .filter((category) => category.categoryName !== "비고")
                      .filter(
                        (category) =>
                          !!category.categoryName &&
                          category.categoryName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      ) */}
                    {displayedCategories
                      .filter((category) => category.categoryName !== "비고")
                      .filter(
                        (category) =>
                          !!category.categoryName &&
                          category.categoryName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      )
                      .map((category) => (
                        <Box key={category.categoryId}>
                          <Checkbox.Root
                            checked={selected.includes(category.categoryId)}
                            onCheckedChange={() => {
                              const isChecked = selected.includes(
                                category.categoryId
                              );
                              if (isChecked) {
                                setSelected((prev) =>
                                  prev.filter((i) => i !== category.categoryId)
                                );
                              } else {
                                setSelected((prev) => [
                                  ...prev,
                                  category.categoryId,
                                ]);
                              }
                            }}
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control
                              _checked={{
                                bg: "#2F6EEA",
                                borderColor: "#2F6EEA",
                              }}
                            />
                            <Checkbox.Label>
                              {category.categoryName}
                            </Checkbox.Label>
                          </Checkbox.Root>
                        </Box>
                      ))}
                  </Box>

                  {/* 태그 영역 */}
                  <Flex
                    direction="row"
                    width="full"
                    padding="2"
                    minHeight={{ base: "50px", md: "25px", lg: "70px" }}
                    maxHeight={{ base: "55px", md: "50px", lg: "70px" }}
                    justifyContent="start"
                    wrap="wrap"
                    overflowY="auto"
                    borderWidth="1px"
                    rounded="md"
                  >
                    {selected &&
                      selected.map((item, index) => (
                        <Flex
                          key={index}
                          alignItems="center"
                          height="fit-content"
                        >
                          <Text fontSize="sm" minWidth="fit-content">
                            {allCategories.find(
                              (cat) => cat.categoryId === item
                            )?.categoryName || item}
                          </Text>
                          <Button
                            size="xs"
                            variant="plain"
                            onClick={() => {
                              setSelected((prev) =>
                                prev.filter((i) => i !== item)
                              );

                              // Explicitly uncheck the checkbox using document query
                              const checkboxes = document.querySelectorAll(
                                'input[type="checkbox"]'
                              ) as NodeListOf<HTMLInputElement>;
                              checkboxes.forEach((checkbox) => {
                                if (
                                  checkbox.nextElementSibling
                                    ?.nextElementSibling?.textContent === item
                                ) {
                                  checkbox.checked = false;
                                }
                              });
                            }}
                          >
                            ✕
                          </Button>
                        </Flex>
                      ))}
                  </Flex>
                </Flex>
              )}

              {/* 다음 페이지 (차트 & 테이블) ======================================================================================= */}
              {step === 2 && (
                <Flex direction="column" height="100%" width="100%">
                  <Tabs.Root value={selectedTab}>
                    <TabContent value="chart">
                      <ContentBox
                        loading={dataLoading}
                        button={
                          <MoveToTableButton
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                          />
                        }
                      >
                        <ChartContent
                          categorizedEsgDataList={categorizedEsgDataList}
                          chartData={chartData}
                          setChartData={setChartData}
                          options={options}
                          setOptions={setOptions}
                        />
                      </ContentBox>
                    </TabContent>
                    <TabContent value="table">
                      <ContentBox
                        loading={dataLoading}
                        button={
                          <MoveToChartButton
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                          />
                        }
                      >
                        <TableContent
                          categorizedEsgDataList={categorizedEsgDataList}
                          setCategorizedEsgDataList={setCategorizedEsgDataList}
                          resetData={getData}
                        />
                      </ContentBox>
                    </TabContent>
                  </Tabs.Root>
                </Flex>
              )}
            </Dialog.Body>

            {/* 생성 버튼 ==================================================== */}
            <Dialog.Footer>
              <Flex
                justifyContent="flex-end"
                width="100%"
                height="100%"
                gap="3"
              >
                {step === 2 && (
                  <Button
                    variant="outline"
                    width="80px"
                    onClick={() => setStep(1)}
                  >
                    이전
                  </Button>
                )}
                {step === 1 && (
                  <Button
                    size="xs"
                    padding="2"
                    height="full"
                    justifyContent="center"
                    alignItems="center"
                    colorScheme="gray"
                    variant="ghost"
                    color="#2F6EEA"
                    onClick={() => setSelected([])}
                    _hover={{ bg: "white" }}
                  >
                    <RiResetLeftFill /> 초기화
                  </Button>
                )}
                <Button
                  bg="#2F6EEA"
                  variant="solid"
                  width="80px"
                  onClick={() => {
                    if (step === 1) setStep(2);
                    else {
                      createChartWithDataSets(
                        options,
                        chartData,
                        categorizedEsgDataList
                      );
                    }
                  }}
                  _hover={{ bg: "#1D4FA3" }}
                >
                  {step === 1 ? "다음" : "생성"}
                </Button>
              </Flex>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color="gray.500" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
