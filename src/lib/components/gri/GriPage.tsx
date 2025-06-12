"use client";
import { Box, Container, VStack, HStack, InputGroup } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import Gri from "./Gris";
import { getCategoryByName, getGri } from "@/lib/api/get";
import { FaSearch } from "react-icons/fa";
import Selector from "./Selector";
import SearchInput from "./SearchInput";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";

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

const yearList = [
  { label: "2020", value: "2020" },
  { label: "2021", value: "2021" },
  { label: "2022", value: "2022" },
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
];
const sectionList = [
  { label: "GRI 200 : 경제", value: "200" },
  { label: "GRI 300 : 환경", value: "300" },
  { label: "GRI 400 : 사회", value: "400" },
];

const GriPage = () => {
  const [searchId, setSearchId] = useState("200");
  const [section, setSection] = useState("200");
  const [year, setYear] = useState("2020");

  const [search, setSearch] = useState<string>("");

  const [griList, setGriList] = useState<SectionCategoryESGData[]>();
  console.log("test", griList);

  const fetchData = useCallback(async () => {
    try {
      const data = await getGri({ year: "2020", categoryName: "" });
      setGriList(data || []);
      console.log("test0", data);
    } catch (error) {
      console.error("fetch 실패");
    }
  }, []);

  // ✅ API 호출 함수 (useCallback)
  const searchCategoryId = useCallback(async (name: string) => {
    try {
      const data = await getCategoryByName(name);
      setSearchId(data?.categoryId ?? "");
    } catch (error) {
      console.error("fetch error", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    searchCategoryId(search);
  }, [search, fetchData]);

  useEffect(() => {
    if (searchId.length > 3) {
      setSection(searchId.substring(0, 3));
    }
  }, [searchId]);

  return (
    <Box {...CARD_STYLES} p={2} w={"120%"} maxH={"80%"}>
      <Container py={4}>
        <VStack gap={8}>
          <HStack w="100%" gap={4} justifyContent="space-between">
            <Selector
              items={sectionList}
              text="GRI Standards"
              value={section}
              onValueChange={setSection}
            />
            <Box position="relative" w="md">
              <InputGroup
                startElement={
                  <Box pl="4" display="flex" alignItems="center">
                    <FaSearch color="#2F6EEA" />
                  </Box>
                }
                alignItems="start"
                w="100%"
              >
                <SearchInput searchCategoryId={setSearch} />
              </InputGroup>
            </Box>
            <HStack>
              <Selector
                items={yearList}
                text="연도"
                value={year}
                onValueChange={setYear}
                width="80px"
              />
            </HStack>
          </HStack>
          <Box minW="100%" maxH="60vh" overflowY="auto" scrollbarWidth={"none"}>
            {/* <Gri section={section} year={year} search={searchId} /> */}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default GriPage;
