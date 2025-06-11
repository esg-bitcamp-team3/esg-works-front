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

// const yearList = [
//   { label: "2020년", value: "2020" },
//   { label: "2021년", value: "2021년" },
//   { label: "2022년", value: "2022년" },
//   { label: "2023년", value: "2023년" },
//   { label: "2024년", value: "2024년" },
//   { label: "2025년", value: "2025년" },
// ];
const yearList = [
  { label: "2020", value: "2020" },
  { label: "2021", value: "2021" },
  { label: "2022", value: "2022" },
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
];
const sectionList = [
  { label: "GRI 200 : 경제", value: "GRI 200 : 경제" },
  { label: "GRI 300 : 환경", value: "GRI 300 : 환경" },
  { label: "GRI 400 : 사회", value: "GRI 400 : 사회" },
];

const GriPage = () => {
  const [search, setSearch] = useState("2050101");
  const [category, setCategory] = useState("200");
  const [year, setYear] = useState("2020");

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

            <SearchBar searching={setSearch} />

            <HStack>
              <Selector
                items={yearList}
                text="연도"
                selected={setYear}
                width="80px"
              />
            </HStack>
          </HStack>
          <Box minW="100%" maxH="60vh" overflowY="auto" scrollbarWidth={"none"}>
            <Gri section={category} year={year} search={search} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default GriPage;
