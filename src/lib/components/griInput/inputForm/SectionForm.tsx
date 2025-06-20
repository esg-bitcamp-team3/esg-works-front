"use client";
import {
  Box,
  Container,
  VStack,
  HStack,
  Skeleton,
  Text,
  Accordion,
  Spinner,
  Flex,
  Separator,
  Button,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Criterion, Section } from "@/lib/interface";
import SectionSelector from "../../section/SectionSelector";
import { getSectionsByCriterion, searchESGData } from "@/lib/api/get";
import CategoryList from "../../section/CategoryList";
import YearSelector from "../../section/YearSelector";
import DynamicInputForm from "../DynamicInputForm";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
import { set } from "lodash";
import { patchESGData } from "@/lib/api/patch";
import { postESGData } from "@/lib/api/post";

const CARD_STYLES = {
  bg: "white",
  borderRadius: "xl",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  _hover: {
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
  },
  overflow: "hidden",
};

type Field = Record<string, string>;

const SectionForm = ({ criterionId }: Criterion) => {
  const [section, setSection] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<string>("");
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [year, setYear] = useState<string>("2020");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [categoryList, setCategoryList] = useState<SectionCategoryESGData>();
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

  // selector에서 선택한 sectionId에 따라 section 보여줌
  const handleSectionChange = (sectionId: string) => {
    setSectionId(sectionId);
    if (!sectionId) {
      setSection(sectionList);
      return;
    }
    const selectedSection = sectionList.find(
      (item) => item.sectionId === sectionId
    );
    if (selectedSection) {
      setSection([selectedSection]);
    } else {
      setSection([]);
    }
  };
  useEffect(() => {
    setSection(sectionList);
  }, [sectionList]);

  // section 변경시마다 categoryList 변경
  const fetchCategories = useCallback(
    (sectionId: string) => {
      setCategoryLoading(true);
      searchESGData({ year, sectionId, categoryName: "" })
        .then(async (data) => {
          await setCategoryList(data || undefined);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setCategoryLoading(false);
        });
    },
    [sectionId, year]
  );

  // categoryList 변경사항 -------------------------------------
  const [fieldValues, setFieldValues] = useState<Field>({});
  const [updateLoading, setUpdateLoading] = useState<string>("");
  const [updated, setUpdated] = useState<string>("");

  const fieldChange = useCallback((categoryId: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  }, []);

  const handleSaveAll = async (key: string) => {
    setUpdateLoading(key);
    try {
      const savePromises = Object.entries(fieldValues).map(
        async ([categoryId, value]) => {
          const outputData = {
            categoryId: categoryId,
            year: year,
            value: value,
          };

          const existing = categoryList?.categoryESGDataList.find(
            (cat) => cat.categoryId === categoryId
          )?.esgData;

          if (existing) {
            return patchESGData(outputData);
          } else {
            return postESGData(outputData);
          }
        }
      );

      // 모든 요청 완료까지 기다림
      await Promise.all(savePromises);
      setUpdated(key);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setUpdateLoading("");
    }
  };

  return (
    <Box {...CARD_STYLES} p={4} w={"70vw"} maxH={"80vw"}>
      <HStack
        justifyContent="space-between"
        w="100%"
        alignItems={"center"}
        p={4}
      >
        <SectionSelector
          sectionList={sectionList}
          setSectionList={setSectionList}
          criterionId={criterionId}
          value={sectionId}
          onValueChange={handleSectionChange}
          loading={loading}
          setLoading={setLoading}
        />
        <YearSelector value={year} onValueChange={setYear} />
      </HStack>

      <Box p={4} width="100%">
        {loading ? (
          <Box width="100%" p={8} textAlign="center">
            <Spinner />
          </Box>
        ) : (
          <Accordion.Root
            collapsible
            width="100%"
            value={[value]}
            onValueChange={(e) => setValue(e.value[0] || "")}
          >
            {section.map((item, index) => (
              <Accordion.Item
                key={index}
                value={index.toString()}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                mb={4}
                overflow="hidden"
                _hover={{ borderColor: "blue.200" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  _hover={{ bg: "blue.50" }}
                  bg={value === index.toString() ? "blue.50" : "white"}
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
                    onClick={() => fetchCategories(item.sectionId)}
                    flex="1"
                  >
                    <Text fontSize="md" fontWeight="bold" color="gray.700">
                      {item.sectionName}
                    </Text>
                  </Accordion.ItemTrigger>

                  <HStack gap={2} p={4}>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation(); // 트리거 클릭 방지
                        handleSaveAll(index.toString());
                      }}
                      colorPalette="blue"
                      px={4}
                      size={"sm"}
                      bg="white"
                      loading={updateLoading === index.toString()}
                    >
                      {updated === index.toString() ? (
                        <Text fontSize="xs" color="green.500">
                          저장 완료
                        </Text>
                      ) : (
                        <Text fontSize="xs" color="gray.900">
                          저장
                        </Text>
                      )}
                    </Button>
                    <Accordion.ItemIndicator colorPalette="blue" />
                  </HStack>
                </Box>

                <Accordion.ItemContent>
                  <Separator />
                  {categoryLoading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      padding={8}
                    >
                      <Spinner size="md" color="blue.500" />
                    </Box>
                  ) : (
                    <VStack gap={2}>
                      {categoryList?.categoryESGDataList.map((item) => (
                        <DynamicInputForm
                          key={item.categoryId}
                          category={item}
                          onValueChange={fieldChange}
                        />
                      ))}
                    </VStack>
                  )}
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        )}
      </Box>
    </Box>
  );
};

export default SectionForm;
