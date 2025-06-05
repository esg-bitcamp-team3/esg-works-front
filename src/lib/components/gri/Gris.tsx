import { Accordion, Box, Span, Icon, Text, Flex } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import TableContent from "./TableContent";
import { useEffect, useState } from "react";
import { Section, SectionList } from "@/lib/interface";
import { getSearchSectionId } from "@/lib/api/get";

interface GriProps {
  section: string;
  year: string;
}

const Gri = ({ section, year }: GriProps) => {
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchSection = await getSearchSectionId(section);
        setSectionList(searchSection || []);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [section]);

  useEffect(() => {
    console.log("sectionList updated:", sectionList);
  }, [sectionList]);

  return (
    <Accordion.Root
      collapsible
      width="100%"
      value={[value]}
      onValueChange={(e) => setValue(e.value[0] || "")}
    >
      {sectionList.map((item, index) => (
        <Accordion.Item
          key={index}
          value={item.sectionId}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          mb={4}
          overflow="hidden"
          _hover={{ borderColor: "blue.200" }}
          transition="all 0.2s ease"
        >
          <Accordion.ItemTrigger
            p={6}
            bg="white"
            _hover={{ bg: "blue.50" }}
            _expanded={{
              bg: "blue.50",
              borderBottomWidth: "1px",
              borderColor: "gray.200",
            }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Text textStyle={"md"} fontWeight="bold" color="gray.700">
              {item.sectionId + " : " + item.sectionName}
            </Text>

            <Accordion.ItemIndicator colorPalette="blue" />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Box p={6} bg="white">
              {<TableContent no={item.sectionId} year={year} />}
            </Box>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default Gri;
