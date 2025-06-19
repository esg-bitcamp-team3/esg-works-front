"use client";
import { Box, Container, VStack, HStack } from "@chakra-ui/react";
import { useState } from "react";
import SectionAccordian from "./SectionAccodian";
import Selector from "./Selector";
import SectionSelector from "../section/SectionSelector";
import { Criterion, Section } from "@/lib/interface";

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
const sectionsSelector = [
  { label: "전체", value: "all" },
  { label: "GRI 200 : 경제", value: "200" },
  { label: "GRI 300 : 환경", value: "300" },
  { label: "GRI 400 : 사회", value: "400" },
];

const GriPage = ({ criterionId, criterionName }: Criterion) => {
  const [sectionSelect, setSectionSelect] = useState("200");
  const [year, setYear] = useState("2020");

  const [loading, setLoading] = useState(true);
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [section, setSection] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<string>("");

  const handleSectionChange = (sectionId: string) => {
    setSectionId(sectionId);
    if (!sectionId) {
      setSection([]);
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

  return (
    <Box {...CARD_STYLES} p={2} w={"70vw"} maxH={"80vw"}>
      <Container py={4}>
        <VStack gap={8}>
          <HStack w="100%" gap={4} justifyContent="space-between">
            <Selector
              items={sectionsSelector}
              // text="GRI Standards"
              value={sectionSelect}
              onValueChange={setSectionSelect}
            />
            <Box position="relative" w="md">
              <SectionSelector
                sectionList={sectionList}
                setSectionList={setSectionList}
                criterionId={criterionId}
                value={sectionId}
                onValueChange={handleSectionChange}
                loading={loading}
                setLoading={setLoading}
              />
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
            <SectionAccordian
              year={year}
              section={sectionSelect}
              search={section}
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default GriPage;
