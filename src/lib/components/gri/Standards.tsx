import { Accordion, Box, Span, Icon, Text, Flex } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import TableContent from "../modal/TableContent";
import { useEffect, useState } from "react";
import { Section, SectionList } from "@/lib/interface";
import { getSearchSectionId } from "@/lib/api/get";

interface StandardsProps {
  criterionId: string;
  year: string;
}

const Standards = ({ criterionId, year }: StandardsProps) => {
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchSection = await getSearchSectionId(criterionId);
        setSectionList(searchSection || []);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [criterionId]);

  useEffect(() => {
    console.log("sectionList updated:", sectionList);
  }, [sectionList]);

  return (
    <>
    <Box>
        {/* {criterionList.map((criterion))} */}
    </Box>
    
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
              {/* {<TableContent no={item.sectionId} year={year} />} */}
            </Box>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
    </>
  );
};

export default Standards;
