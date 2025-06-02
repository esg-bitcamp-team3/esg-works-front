"use client";
import {
  Box,
  Input,
  Container,
  VStack,
  HStack,
  InputGroup,
} from "@chakra-ui/react";
import { useState } from "react";
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
const yearList = ["2020", "2021", "2022", "2023", "2024"];

const GriPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("300");
  const [year, setYear] = useState("2020");

  return (
    <Box {...CARD_STYLES} p={2} w={{ base: "100%", md: "100%" }}>
      <Container maxW="100%" py={5}>
        <VStack gap={8}>
          <HStack w="80%" gap={4} justifyContent="space-between">
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
                text="GRI Standards"
                selected={setCategory}
              />
              <Selector items={yearList} text="연도" selected={setYear} />
            </HStack>
          </HStack>

          <Box minW="80%">
            <Gri section={category} year={year} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default GriPage;
