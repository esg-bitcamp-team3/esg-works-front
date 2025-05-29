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
import { useState } from "react";
import ChartContent from "./ChartContent";
import TableContent from "./TableContent";
import {
  Bar,
  Line,
  Pie,
  Radar,
  Doughnut,
} from "react-chartjs-2";

const gristandards = createListCollection({
  items: [
    { label: "Environment", value: "environment" },
    { label: "Social", value: "social" },
    { label: "Governance", value: "governance" },
  ],
});

interface Item {
  id: string;
  title: string;
  icons: React.ComponentType<any>;
  content: React.ReactNode;
}

interface ChartType {
  type: string;
  label: string;
  icons: React.ComponentType<any>;
}

const chartType: ChartType[] = [
  { type: "Bar", label: "막대 차트", icons: FaChartPie },
  { type: "Line", label: "선 차트", icons: FaPen },
  { type: "Pie", label: "파이 차트", icons: FaChartPie },
  { type: "Radar", label: "레이더 차트", icons: FaTable },
  { type: "Doughnut", label: "도넛 차트", icons: FaChartPie },
  { type: "Scatter", label: "산점도 차트", icons: FaSearch },
  { type: "Bubble", label: "버블 차트", icons: FaPen },
  { type: "PolarArea", label: "폴라 영역 차트", icons: FaTable },
];

export const chartData = {
  labels: ["2020", "2021", "2022", "2023", "2024"],
  datasets: [
    {
      label: "퇴직율",
      data: [12, 14, 13, 11, 10],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    },
    {
      label: "근속연수",
      data: [5.2, 5.5, 5.8, 6.0, 6.3],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
    {
      label: "이직율",
      data: [7, 6.5, 6.8, 6.2, 5.9],
      backgroundColor: "rgba(255, 206, 86, 0.6)",
    },
  ],
};

export default function ChartModal() {
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [charts, setCharts] = useState<ChartType[]>(chartType);
  const [selectedTab, setSelectedTab] = useState<string | null>("chart");

  return (
    <Dialog.Root placement="center" motionPreset="scale" size="lg">
      <Dialog.Trigger asChild>
        <Button
          size="xl"
          p="3"
          borderRadius="full"
          bg="#2F6EEA"
          color="white"
          position="fixed"
          bottom="4"
          right="4"
        >
          <FaPlus />
        </Button>
      </Dialog.Trigger>

      {/* 모달창 =================================================== */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            padding={{ base: 4, md: 6 }}
            gap={{ base: 4, md: 6 }}
            height={{
              base: "90vh",
              sm: "85vh",
              md: "75vh",
              lg: "65vh",
            }}
            width={{ base: "95%", sm: "85%", md: "75%", lg: "60%" }}
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
                    // minHeight={{base: "50vh", md: "40vh", lg: "30vh"}}
                    minHeight={{ base: "45vh", md: "35vh", lg: "30vh" }}
                    maxHeight={{ base: "50vh", md: "40vh", lg: "30vh" }}
                    padding="4"
                    overflowY="auto"
                  >
                    {[
                      "퇴직율",
                      "근속연수",
                      "이직율",
                    ].map((item, index) => (
                      <Checkbox.Root
                        key={index}
                        checked={selected.includes(item)}
                        onCheckedChange={() => {
                          const isChecked = selected.includes(item);
                          if (isChecked) {
                            // Uncheck: remove tag and update state
                            setSelected((prev) =>
                              prev.filter((i) => i !== item)
                            );
                          } else {
                            // Check: add tag only if it's not already present
                            setSelected((prev) => [...prev, item]);
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
                        <Checkbox.Label>{item}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </Box>
                  {/* 태그 영역 */}
                  <Flex
                    direction="row"
                    width="full"
                    alignItems="start"
                    minHeight={{ base: "50px", md: "45px", lg: "30px" }}
                    maxHeight={{ base: "55px", md: "50px", lg: "65px" }}
                    gapX="2"
                    paddingX='2'
                    wrap="wrap"
                    overflowY="auto"
                  >
                    {selected &&
                      selected.map((item, index) => (
                        <Flex
                          key={index}
                          direction="row"
                          justifyContent="left"
                          alignItems="center"
                          borderWidth="0"
                          borderRadius="md"
                        >
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
                    height="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    {/* <Tabs.List flex="1 1 auto"> */}
                    <Tabs.List flexShrink={0}>
                      <Tabs.Trigger
                        value="chart"
                        key="chart"
                        paddingLeft="5"
                        paddingRight="5"
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

                    <Tabs.ContentGroup paddingTop="4">
                      <Tabs.Content value="chart">
                        <ChartContent selected={selected} charts={charts} />
                      </Tabs.Content>
                      <Tabs.Content value="table">
                        {/* 2번 탭 콘텐츠 */}
                        <TableContent />
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
