"use client";
import { Box, Input, Container, VStack, HStack } from "@chakra-ui/react";
import { useState } from "react";
import Selector from "./Selector";
import { FaSearch } from "react-icons/fa";
import TableContent from "./TableContent";
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

const GriPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");

  const frameworks = [
    { label: "React.js", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ];
  const items = [
    { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
    { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
    { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
    { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
    { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
  ];

  return (
    <Box {...CARD_STYLES} p={2} w={{ base: "100%", md: "100%" }}>
      <Container maxW="100%" py={5}>
        <VStack spaceX={6}>
          <HStack w="80%" gap={4} justifyContent="space-between">
            <HStack>
              <FaSearch color="#2F6EEA" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                flex={1}
              />
            </HStack>

            <HStack>
              <Selector items={frameworks} text="GRI Standards" />
              <Selector items={frameworks} text="연도" />
            </HStack>
          </HStack>

          <Box minW="80%">
            <Gri />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default GriPage;
