"use client";
import {
  Box,
  Input,
  Container,
  VStack,
  HStack,
  InputGroup,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Selector from "./Selector";
import { FaSearch } from "react-icons/fa";
import Gri from "./Gris";
import { Category } from "@/lib/interface";
import { getCategory } from "@/lib/api/get";
import SearchBar from "./SearchBar";

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
  { label: "2020년", value: "2020" },
  { label: "2021년", value: "2021" },
  { label: "2022년", value: "2022" },
  { label: "2023년", value: "2023" },
  { label: "2024년", value: "2024" },
  { label: "2025년", value: "2025" },
];
const sectionList = [
  { label: "GRI 200: 경제", value: "200" },
  { label: "GRI 300: 환경", value: "300" },
  { label: "GRI 400: 사회", value: "400" },
];

const GriPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("200");
  const [year, setYear] = useState("2020");

  const [isLoading, setIsLoading] = useState(true);

  // 로딩 시뮬레이션 (데이터 fetch)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700); // 1초 후 로딩 종료 (예: fetch 완료)

    return () => clearTimeout(timer);
  }, [category, year]);

  return (
    <Box {...CARD_STYLES} p={2} w={"120%"} maxH={"80%"}>
      <Container py={4}>
        <VStack gap={8}>
          <HStack w="100%" gap={4} justifyContent="space-between">
            <Selector
              items={sectionList}
              text="GRI Standards"
              selected={setCategory}
            />
            <HStack>
              {/* <InputGroup
                startElement={
                  <Box pl="4" display="flex" alignItems="center">
                    <FaSearch color="#2F6EEA" />
                  </Box>
                }
                alignItems="start"
                w="md"
              >
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  flex={1}
                  bg={"white"}
                  borderWidth="1px" // 테두리 두께를 1px로 설정
                  marginX={4}
                />
              </InputGroup> */}
              <SearchBar searching={setSearch} />
            </HStack>

            <HStack>
              <Selector
                items={yearList}
                text="연도"
                selected={setYear}
                width="100px"
              />
            </HStack>
          </HStack>
          <Box minW="100%" maxH="60vh" overflowY="auto" scrollbarWidth={"none"}>
            {isLoading ? (
              <VStack w="100%" gap={4}>
                <Skeleton height="40px" w="100%" />
                <Skeleton height="40px" w="100%" />
                <Skeleton height="40px" w="100%" />
                <Spinner size="lg" color="blue.500" />
              </VStack>
            ) : (
              <Gri section={category} year={year} />
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default GriPage;
