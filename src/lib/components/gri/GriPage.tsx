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

const sectionList = ["200", "300", "400"];
const yearList = ["2020", "2021", "2022", "2023", "2024", "2025"];

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
    <Box {...CARD_STYLES} p={2} w={"100%"}>
      <Container py={4}>
        <VStack gap={8}>
          <HStack w="100%" gap={4} justifyContent="space-between">
            <HStack>
              <InputGroup
                startElement={
                  <Box pl="3" display="flex" alignItems="center">
                    <FaSearch color="#2F6EEA" />
                  </Box>
                }
                alignItems="start"
                w="lg"
              >
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  flex={1}
                />
              </InputGroup>
            </HStack>

            <HStack>
              <Selector
                items={sectionList}
                // text="GRI Standards"
                text={category}
                selected={setCategory}
              />
              <Selector
                items={yearList}
                // text="연도"
                text={year}
                selected={setYear}
              />
            </HStack>
          </HStack>

          <Box minW="80%" maxHeight="80vh" overflowY="auto">
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
