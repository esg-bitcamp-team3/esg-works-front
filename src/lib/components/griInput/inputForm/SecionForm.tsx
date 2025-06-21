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
  Breadcrumb,
  Icon,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Criterion, Section } from "@/lib/interface";

import {
  getCriteria,
  getSectionsByCriterion,
  searchESGData,
} from "@/lib/api/get";
import CategoryList from "../../section/CategoryList";
import YearSelector from "../../section/YearSelector";
import DynamicInputForm from "../DynamicInputForm";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
import { set } from "lodash";
import { patchESGData } from "@/lib/api/patch";
import { postESGData } from "@/lib/api/post";
import { LuCheck, LuClipboardPen, LuSave } from "react-icons/lu";
import SectionSelector from "../../edit/SectionSelector";

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

interface SectionFormProps {
  criterionId: string;
}

const SectionForm = ({ criterionId }: SectionFormProps) => {
  const [section, setSection] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<string>("");
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [year, setYear] = useState<string>("2020");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [categoryList, setCategoryList] = useState<SectionCategoryESGData>();
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

  const [criterion, setCriterion] = useState<Criterion>();
  const [criterionLoading, setCriterionLoading] = useState(true);

  useEffect(() => {
    setCriterionLoading(true);
    getCriteria(criterionId)
      .then((data) => {
        if (data) setCriterion(data);
      })
      .finally(() => setCriterionLoading(false));
  }, [criterionId]);

  const getData = async () => {
    try {
      setLoading(true);
      const data = (await getSectionsByCriterion(criterionId)) || [];
      setSectionList(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [criterionId]);

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
    <Box w="100%" h="100%" overflow={"auto"}>
      <Flex alignItems="center">
        {criterionLoading ? (
          <Skeleton width="200px" height="20px" borderRadius="md" />
        ) : (
          <Breadcrumb.Root size="md">
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/criteria">평가 기준</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href={`/criteria/${criterion?.criterionId}`}>
                  {criterion?.criterionName}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />

              <Breadcrumb.Item>
                <Breadcrumb.CurrentLink>{"데이터 입력"}</Breadcrumb.CurrentLink>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        )}
      </Flex>
      <Flex
        alignItems="center"
        mb={2}
        borderBottom="2px solid"
        borderColor="gray.200"
        pb={3}
        pt={3}
        justifyContent="space-between"
        width={"100%"}
        position={"sticky"}
      >
        <HStack>
          <Icon as={LuClipboardPen} fontSize="xl" color="blue.500" />
          <Text fontSize="xl" fontWeight="600" color="blue.500">
            데이터 입력
          </Text>
          <Badge
            colorScheme="blue"
            borderRadius="full"
            px={2}
            textAlign={"center"}
            justifyContent={"center"}
            justifyItems={"center"}
            alignItems={"center"}
            alignContent={"center"}
            size={"md"}
            fontSize={"xs"}
          >
            {section.length}
          </Badge>
        </HStack>
        <HStack>
          <SectionSelector
            sectionList={sectionList}
            value={sectionId}
            onValueChange={handleSectionChange}
            loading={loading}
            setLoading={setLoading}
          />
        </HStack>
      </Flex>
      <VStack
        align="center"
        width="100%"
        gap={4}
        padding={2}
        overflowY="auto"
        maxH={"60vh"}
      >
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
            size="sm"
            variant={"subtle"}
          >
            {section.map((item, index) => (
              <Accordion.Item
                key={index}
                value={index.toString()}
                overflow="hidden"
                transition="all 0.2s ease"
              >
                <Accordion.ItemTrigger asChild>
                  <HStack
                    p={6}
                    _hover={{ bg: "gray.100" }}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    onClick={() => {
                      if (index.toString() === value) {
                        setValue("");
                        return;
                      }
                      fetchCategories(item.sectionId);
                      setValue(index.toString());
                    }}
                  >
                    <Text fontSize="md" color="gray.700" ml={4}>
                      {item.sectionName}
                    </Text>
                    <HStack gap={2}>
                      <IconButton
                        variant="plain"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveAll(index.toString());
                        }}
                        loading={updateLoading === index.toString()}
                      >
                        {updated === index.toString() ? (
                          <Icon as={LuCheck} color="green.500" />
                        ) : (
                          <Icon as={LuSave} color="gray.700" />
                        )}
                      </IconButton>
                      <Accordion.ItemIndicator colorPalette="blue" />
                    </HStack>
                  </HStack>
                </Accordion.ItemTrigger>

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
                  ) : categoryList?.categoryESGDataList.length === 0 ? (
                    <Flex
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      color="gray.500"
                      padding={8}
                    >
                      <Text fontSize="sm" mt={2}>
                        해당 세부 항목에 입력할 데이터가 없습니다.
                      </Text>
                    </Flex>
                  ) : (
                    <VStack gap={2} padding={4}>
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
      </VStack>
    </Box>
  );
};

export default SectionForm;
