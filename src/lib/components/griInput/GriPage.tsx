"use client";
import {
  Box,
  Container,
  VStack,
  HStack,
  Skeleton,
  Breadcrumb,
  Flex,
  Icon,
  Text,
  Badge,
  Spinner,
  Accordion,
  IconButton,
  Separator,
} from "@chakra-ui/react";
import { use, useCallback, useEffect, useState } from "react";
import SectionAccordian from "./SectionAccodian";
import Selector from "./Selector";
import { Criterion, Section } from "@/lib/interface";
import {
  getCriteria,
  getGriByYearAndSectionId,
  getSectionsByCriterion,
  searchESGData,
} from "@/lib/api/get";
import { LuCheck, LuClipboardPen, LuSave } from "react-icons/lu";
import SectionSelector from "../edit/SectionSelector";
import YearSelector from "./YearSelector";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
import SubsectionAccordian from "./SubsectionAccordian";
import SubsectionList from "./SubsectionList";

const sectionsSelector = [
  { label: "전체", value: "all" },
  { label: "GRI 200 : 경제", value: "2" },
  { label: "GRI 300 : 환경", value: "3" },
  { label: "GRI 400 : 사회", value: "4" },
];

type Field = Record<string, string>;

const GriPage = ({ criterionId, criterionName }: Criterion) => {
  const [sectionSelect, setSectionSelect] = useState("all");
  const [year, setYear] = useState("2020");

  const [loading, setLoading] = useState(true);
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [section, setSection] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<string>("");
  const [criterion, setCriterion] = useState<Criterion>();
  const [criterionLoading, setCriterionLoading] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");

  const [categoryList, setCategoryList] = useState<SectionCategoryESGData>();
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);

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

  const fetchCategories = useCallback(
    (sectionId: string) => {
      setCategoryLoading(true);
      getGriByYearAndSectionId(year, sectionId)
        .then(async (data) => {
          console.log("Fetched categories:", data);
          setCategoryList(data || undefined);
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

  useEffect(() => {
    if (sectionSelect === "all") {
      setSection(sectionList);
    } else {
      const filteredSections = sectionList.filter((item) =>
        item.sectionId.startsWith(sectionSelect)
      );
      setSection(filteredSections);
    }
  }, [sectionSelect]);

  return (
    <Box w="100%" h="100%" overflow={"auto"}>
      <Flex alignItems="center">
        {criterionLoading ? (
          <Skeleton width="200px" height="20px" borderRadius="md" />
        ) : (
          <Breadcrumb.Root size="md">
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/disclosure-data">
                  공시 기준
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  href={`/disclosure-data/${criterion?.criterionId}`}
                >
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
            GRI 데이터 입력
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
          <Selector
            items={sectionsSelector}
            // text="GRI Standards"
            value={sectionSelect}
            onValueChange={setSectionSelect}
          />
          <SectionSelector
            sectionList={sectionList}
            value={sectionId}
            onValueChange={handleSectionChange}
            loading={loading}
            setLoading={setLoading}
          />
          <YearSelector value={year} onValueChange={setYear} />
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
                    py={8}
                    _hover={{ bg: "gray.100" }}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    height={"100%"}
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
                      {item.sectionId + " : " + item.sectionName}
                    </Text>

                    <Accordion.ItemIndicator colorPalette="blue" />
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
                      {categoryList && (
                        <SubsectionList section={categoryList} year={year} />
                      )}
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

export default GriPage;
