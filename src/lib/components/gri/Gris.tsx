import { Accordion, Box, Span, Icon } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import TableContent from "./TableContent";
import { useState } from "react";
import { Section, SectionList } from "@/lib/interface";

const lst: Section[] = [
  { sectionId: "201", sectionName: "경제성과" },
  { sectionId: "202", sectionName: "시장지위" },
];

const Gri = () => {
  const [sectionList, setSectionList] = useState<SectionList>({
    sectionNum: "200",
    sectionList: lst,
  });

  return (
    <Accordion.Root collapsible width="100%">
      {sectionList.sectionList.map((item, index) => (
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
          >
            <Span flex="1" fontSize="lg" fontWeight="semibold" color="gray.700">
              {item.sectionId + " : " + item.sectionName}
            </Span>
            <Icon
              as={FaChevronDown}
              transform="auto"
              transition="transform 0.2s ease"
              _expanded={{ transform: "rotate(180deg)" }}
              color="blue.500"
            />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Box p={6} bg="white" borderTop="none">
              {<TableContent no={item.sectionId} />}
            </Box>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default Gri;
