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
  Spinner,
  Menu,
} from "@chakra-ui/react";
import { FaPen, FaSearch, FaChartPie, FaTable, FaPlus } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import TableContent from "./TableContent";
import { CategoryDetail, Section } from "@/lib/api/interfaces/categoryDetail";

import { ChartType } from "@/lib/api/interfaces/chart";
import {
  getSections,
  getCategories,
  getEsgData,
  getCriterion,
  getSectionsByCriterion,
} from "@/lib/api/get";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";
import ContentBox from "./ContentBox";
import { CustomEditor } from "@/lib/editor/custom-types";
import { insertTableFromData } from "@/lib/editor/example";
import { RiResetLeftFill } from "react-icons/ri";
import { Criterion } from "@/lib/interface";
import { LuTable2 } from "react-icons/lu";
import { set } from "lodash";

const chartType: ChartType[] = [
  { type: "bar", label: "막대 차트", icons: FaChartPie },
  { type: "line", label: "선 차트", icons: FaPen },
  { type: "pie", label: "파이 차트", icons: FaChartPie },
  { type: "doughnut", label: "도넛 차트", icons: FaChartPie },
  { type: "mixed", label: "믹스 차트", icons: FaTable },
];

export default function TableModal({
  editor,
  trigger,
}: {
  editor: CustomEditor;
  trigger: React.ReactNode;
}) {
  const [selectedCategoryList, setSelectedCategoryList] = useState<
    CategoryDetail[]
  >([]);
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
  const [categorizedEsgDataList, setCategorizedEsgDataList] = useState<
    CategorizedESGDataList[]
  >([]);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [criterionLoading, setCriterionLoading] = useState<boolean>(false);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
  const [sectionLoading, setSectionLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCategories, setFilteredCategories] = useState<
    CategoryDetail[]
  >([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCriterion = async () => {
      setCriterionLoading(true);
      try {
        const criterion = await getCriterion();
        setCriterion(criterion);
      } catch (error) {
        console.error("평가 기준 가져오기 실패:", error);
        setCriterion([]);
      } finally {
        setCriterionLoading(false);
      }
    };
    fetchCriterion();
  }, []);

  const criteria = createListCollection({
    items: criterion
      .filter((c) => c.criterionId && c.criterionName)
      .map((c) => ({
        label: c.criterionName,
        value: c.criterionId,
      })),
  });

  // Section이 선택된 경우: 해당 section의 카테고리만 fetch
  useEffect(() => {
    if (!selectedSectionId) {
      return;
    }
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const data = await getCategories(selectedSectionId);
        setCategories(data);
      } catch {
        console.error("카테고리 불러오기 실패");
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, [selectedSectionId]);

  // Criterion만 선택된 경우: criterion에 속한 모든 section의 모든 category를 fetch & 합침
  useEffect(() => {
    // section이 선택된 경우에는 동작하지 않음
    if (!selectedCriterionId) {
      return;
    }

    const fetchAllCategoriesInCriterion = async () => {
      // criterion에 속한 모든 section id를 불러와서, 각 섹션의 카테고리 fetch 후 합침
      setCategoryLoading(true);
      try {
        const response = await getSectionsByCriterion(selectedCriterionId);
        setSections(response);
        if (!response || response.length === 0) {
          setCategories([]);
          return;
        }
        // 모든 section의 카테고리 fetch
        const all = await Promise.all(
          response.map((sec) => getCategories(sec.sectionId))
        );
        // 2차원 배열을 1차원으로 평탄화
        const flat = all.flat();
        setCategories(flat);
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchAllCategoriesInCriterion();
  }, [selectedCriterionId]);

  // 선택된 criterionId에 해당하는 section만 표시
  const sectionCollection = createListCollection({
    items: sections.map((section) => ({
      label: section.sectionName,
      value: section.sectionId,
    })),
  });

  const getData = async () => {
    setDataLoading(true);
    Promise.all(
      selectedCategoryList.map((category) => getEsgData(category.categoryId))
    )
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
    if (selectedCategoryList.length > 0) {
      getData();
    }
  }, [selectedCategoryList]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      // 검색어가 비어있으면 모든 카테고리 표시
      setFilteredCategories(categories);
    } else {
      // 검색어가 있을 때 필터링된 카테고리만 표시
      setFilteredCategories(
        categories.filter(
          (category) =>
            category.categoryName &&
            category.categoryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    // 초기화 시 모든 카테고리 표시
    setFilteredCategories(categories);
  }, [categories]);

  return (
    <Dialog.Root
      placement="center"
      motionPreset="scale"
      size="lg"
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Dialog.Trigger w={"100%"}>{trigger}</Dialog.Trigger>
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
                테이블 삽입
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
                            placeholder="평가 기준"
                            fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                            fontWeight={"500"}
                          />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          {criterionLoading && (
                            <Spinner
                              size="xs"
                              borderWidth="1.5px"
                              color="fg.muted"
                            />
                          )}
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
                              rounded="md"
                              fontSize={{ base: "xs", md: "sm", lg: "sm" }}
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
                      collection={sectionCollection}
                      disabled={!selectedCriterionId}
                      h="100%"
                      w="100%"
                      flex={{ base: "1", md: "1", lg: "1" }}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText
                            placeholder="세부 평가"
                            fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                            fontWeight={"500"}
                          />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          {sectionLoading && (
                            <Spinner
                              size="xs"
                              borderWidth="1.5px"
                              color="fg.muted"
                            />
                          )}
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>

                      <Select.Positioner>
                        <Select.Content p={2}>
                          {sectionCollection.items.length === 0 && (
                            <Text fontSize="xs" color="gray.500">
                              선택된 평가 기준에 해당하는 세부 평가 기준이
                              없습니다.
                            </Text>
                          )}
                          {sectionCollection.items.map((item) => (
                            <Select.Item
                              item={item}
                              key={item.value}
                              onClick={() => {
                                console.log("📌 선택된 섹션 ID:", item.value);
                                setSelectedSectionId(item.value || null);
                              }}
                              rounded="md"
                              fontSize={{ base: "xs", md: "sm", lg: "sm" }}
                              justifyContent={"space-between"}
                            >
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>

                    {/* 검색 */}
                    <InputGroup
                      startElement={
                        <Box>
                          <FaSearch />
                        </Box>
                      }
                      alignItems="start"
                      width={{ base: "100%", md: "60%" }}
                      flex={{ base: "1", md: "2", lg: "3" }}
                    >
                      <Input
                        placeholder="검색"
                        fontSize="sm"
                        w="100%"
                        value={searchTerm}
                        disabled={!selectedCriterionId}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        _focus={{ borderColor: "gray.400" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                      />
                    </InputGroup>
                  </Flex>

                  {/* 체크박스 목록 영역 */}
                  {categoryLoading ? (
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
                      justifyContent={"center"}
                      justifyItems={"center"}
                      alignItems={"center"}
                    >
                      <Spinner size="md" color="#2F6EEA" />
                    </Box>
                  ) : (
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
                      {filteredCategories
                        .filter((category) => category.categoryName !== "비고")
                        .map((category) => (
                          <Box key={category.categoryId}>
                            <Checkbox.Root
                              checked={selectedCategoryList.includes(category)}
                              onCheckedChange={() => {
                                const isChecked =
                                  selectedCategoryList.includes(category);
                                if (isChecked) {
                                  setSelectedCategoryList((prev) =>
                                    prev.filter((i) => i !== category)
                                  );
                                } else {
                                  setSelectedCategoryList((prev) => [
                                    ...prev,
                                    category,
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
                  )}

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
                    {selectedCategoryList &&
                      selectedCategoryList.map((item, index) => (
                        <Flex
                          key={index}
                          alignItems="center"
                          height="fit-content"
                        >
                          <Text fontSize="sm" minWidth="fit-content">
                            {item.categoryName}
                          </Text>
                          <Button
                            size="xs"
                            variant="ghost"
                            _hover={{ bg: "white" }}
                            onClick={() => {
                              setSelectedCategoryList((prev) =>
                                prev.filter((i) => i !== item)
                              );

                              // Explicitly uncheck the checkbox using document query
                              const checkboxes = document.querySelectorAll(
                                'input[type="checkbox"]'
                              ) as NodeListOf<HTMLInputElement>;
                              checkboxes.forEach((checkbox) => {
                                if (
                                  checkbox.nextElementSibling
                                    ?.nextElementSibling?.textContent ===
                                  item.categoryName
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
                  <TableContent
                    categorizedEsgDataList={categorizedEsgDataList}
                    setCategorizedEsgDataList={setCategorizedEsgDataList}
                    resetData={getData}
                  />
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
                    onClick={() => setSelectedCategoryList([])}
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
                      insertTableFromData(editor, categorizedEsgDataList);
                      closeButtonRef.current?.click();
                    }
                  }}
                  _hover={{ bg: "#1D4FA3" }}
                >
                  {step === 1 ? "다음" : "생성"}
                </Button>
              </Flex>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton ref={closeButtonRef} size="sm" color="gray.500" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
