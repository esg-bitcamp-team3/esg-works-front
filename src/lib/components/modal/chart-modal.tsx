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
  Icon,
} from "@chakra-ui/react";
import { FaPen, FaSearch, FaChartPie, FaTable, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import TableContent from "./TableContent";
import { CategoryDetail, Section } from "@/lib/api/interfaces/categoryDetail";

import { ChartType } from "@/lib/api/interfaces/chart";
import { getSections, getCategories, getEsgData } from "@/lib/api/get";

import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";
import PieChartContent from "./PieChartContent";
import MixedChartContent from "./MixedChartContent";

// const ChartContent = dynamic(() => import("./ChartContent"), { ssr: false });

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

  const [charts] = useState<ChartType[]>(chartType);

  const [selectedTab, setSelectedTab] = useState<string | null>("chart");

  const [sections, setSections] = useState<Section[]>([]);

  const [categories, setCategories] = useState<CategoryDetail[]>([]);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );

  const [categorizedEsgDataList, setCategorizedEsgDataList] = useState<
    CategorizedESGDataList[]
  >([]);

  const [dataLoading, setDataLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sections = await getSections();
        console.log("Fetched sections:", sections);
        setSections(sections);
      } catch (error) {
        console.error("섹션 가져오기 실패:", error);
        setSections([]); // Set to empty array on error
      }
    };
    fetchSections();
  }, []);

  // Fetch categories when selectedSectionId changes
  useEffect(() => {
    if (!selectedSectionId) return;
    const fetchCategories = async () => {
      const data = await getCategories(selectedSectionId);
      console.log("카테고리 응답 데이터:", data);
      setCategories(data);
    };
    fetchCategories();
  }, [selectedSectionId]);

  const gristandards = createListCollection({
    items: sections
      .filter((sections) => sections.sectionId && sections.sectionName)
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
                    gap={3}
                  >
                    {/* GRI Standards Select ============================================== */}
                    <Select.Root
                      collection={gristandards}
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
                            placeholder="GRI Standards"
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
                                setSelectedSectionId(gristandard.value);
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

                    <InputGroup
                      startElement={
                        <Box pl="3" display="flex" alignItems="center">
                          <FaSearch />
                        </Box>
                      }
                      alignItems="start"
                      width={{ base: "100%", md: "60%" }}
                      flex={{ base: "1", md: "2", lg: "3" }}
                    >
                      <Input placeholder="검색" />
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
                    minHeight={{ base: "45vh", md: "35vh", lg: "40vh" }}
                    maxHeight={{ base: "50vh", md: "40vh", lg: "45vh" }}
                    padding="4"
                    overflowY="auto"
                  >
                    {categories
                      .filter((category) => category.categoryName !== "비고")
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
                    width="full"
                    minHeight={{ base: "50px", md: "25px", lg: "100px" }}
                    maxHeight={{ base: "55px", md: "50px", lg: "100px" }}
                    gapX="2"
                    paddingX="2"
                    wrap="wrap"
                    overflowY="auto"
                    borderWidth="1px"
                    rounded="md"
                  >
                    {selected &&
                      selected.map((item, index) => (
                        <Flex key={index} alignItems="center">
                          <Text fontSize="sm" minWidth="fit-content">
                            {item}
                          </Text>
                          <Button
                            size="xs"
                            variant="ghost"
                            _hover={{ bg: "white" }}
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
                  <Tabs.Root
                    variant="outline"
                    size="lg"
                    defaultValue={selectedTab}
                    onValueChange={(e) => setSelectedTab(e.value)}
                    display="flex"
                    flexDirection="column"
                  >
                    <Tabs.List flexShrink={0}>
                      <Tabs.Trigger
                        value="chart"
                        key="chart"
                        // paddingLeft="5"
                        // paddingRight="5"
                      >
                        <Icon as={FaChartPie} style={{ marginRight: 4 }} />
                        {"차트"}
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="table"
                        key="table"
                        paddingLeft="5"
                        paddingRight="5"
                      >
                        <Icon as={FaTable} style={{ marginRight: 4 }} />

                        {"테이블"}
                      </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.ContentGroup>
                      <Tabs.Content value="chart">
                        <MixedChartContent
                          categorizedEsgDataList={categorizedEsgDataList}
                          charts={charts}
                        />
                      </Tabs.Content>

                      <Tabs.Content value="table">
                        {/* 2번 탭 콘텐츠 */}
                        {dataLoading ? (
                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                          >
                            <Text>데이터를 불러오는 중...</Text>
                          </Flex>
                        ) : (
                          <TableContent
                            resetData={getData}
                            setCategorizedEsgDataList={
                              setCategorizedEsgDataList
                            }
                            categorizedEsgDataList={categorizedEsgDataList}
                          />
                        )}
                      </Tabs.Content>
                    </Tabs.ContentGroup>
                  </Tabs.Root>
                </Flex>
              )}
            </Dialog.Body>

            {/* 생성 버튼 ==================================================== */}
            <Dialog.Footer>
              <Flex justifyContent="flex-end" width="100%" gap="3">
                {step === 2 && (
                  <Button
                    variant="outline"
                    width="80px"
                    onClick={() => setStep(1)}
                  >
                    이전
                  </Button>
                )}
                <Button
                  bg="#2F6EEA"
                  variant="solid"
                  width="80px"
                  onClick={() => {
                    if (step === 1) setStep(2);
                    else console.log("차트 생성 시작", selected);
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
