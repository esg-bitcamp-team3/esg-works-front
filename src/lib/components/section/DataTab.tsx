import { Accordion, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CriterionSelector from "./CriterionSelector";
import SearchBar from "./SearchBar";
import SectionSelector from "./SectionSelector";
import YearSelector from "./YearSelector";
import { Section } from "@/lib/interface";
import CategoryList from "./CategoryList";
import GRICategoryList from "./GRICategoryList";
import { searchGRIData } from "@/lib/api/get";

const DataTab = () => {
  const [criterion, setCriterion] = useState<string>("cri-01");
  const [section, setSection] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<string>("");
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [query, setQuery] = useState<string>("");
  const [year, setYear] = useState<string>("2020");
  const [value, setValue] = useState<string>("");

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

  return (
    <Box w="100%" pt={4} pb={4}>
      <HStack justifyContent="space-between" w="100%" alignItems={"center"}>
        <CriterionSelector value={criterion} onValueChange={setCriterion} />
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={() => console.log("Search triggered with query:", query)}
        />
      </HStack>
      <Flex w="100%" pt={4} pb={4} justifyContent={"end"}>
        <VStack
          width="auto"
          justifyContent="flex-end"
          justifyItems={"flex-end"}
          mx={4}
        >
          <SectionSelector
            sectionList={sectionList}
            setSectionList={setSectionList}
            criterionId={criterion}
            value={sectionId}
            onValueChange={handleSectionChange}
          />
          <YearSelector value={year} onValueChange={setYear} />
        </VStack>
      </Flex>
      <Box>
        <Accordion.Root
          collapsible
          width="100%"
          value={[value]}
          onValueChange={(e) => setValue(e.value[0])}
          borderWidth="1px"
        >
          {section.map((item, index) => (
            <Accordion.Item
              key={index}
              value={item.sectionId}
              overflow="hidden"
              _hover={{ borderColor: "blue.200" }}
              transition="all 0.2s ease"
            >
              <Accordion.ItemTrigger
                bg="white"
                _hover={{ bg: "blue.50" }}
                _expanded={{
                  bg: "blue.50",
                }}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                p={4}
              >
                <Text fontWeight="medium" fontSize="md">
                  {item.sectionName}
                </Text>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  {value === item.sectionId && (
                    <Box p={6} bg="white">
                      {criterion === "cri-01" ? (
                        <GRICategoryList
                          sectionId={item.sectionId}
                          query={query}
                          year={year}
                        />
                      ) : (
                        <CategoryList
                          sectionId={item.sectionId}
                          query={query}
                          year={year}
                        />
                      )}
                    </Box>
                  )}
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Box>
    </Box>
  );
};

export default DataTab;
