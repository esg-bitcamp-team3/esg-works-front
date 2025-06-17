import { Accordion, Box, Text, VStack, Skeleton } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Section } from "@/lib/interface";
import { getSearchSectionId } from "@/lib/api/get";
import SubsectionAccordian from "./SubsectionAccordian";

interface GriProps {
  section: string;
  year: string;
  search: string;
}

const Gri = ({ section, year, search }: GriProps) => {
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [value, setValue] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const searchSection = await getSearchSectionId(section);
      setSectionList(searchSection || []);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }, [section]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <VStack w="100%" gap={4}>
        <Skeleton height="50px" w="100%" />
        <Skeleton height="50px" w="100%" />
        <Skeleton height="50px" w="100%" />
      </VStack>
    );
  }

  return (
    <Accordion.Root
      collapsible
      width="100%"
      value={[value]}
      onValueChange={(e) => setValue(e.value[0] || "")}
    >
      {sectionList.map((item) => (
        <Accordion.Item
          key={item.sectionId}
          value={item.sectionId}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          mb={4}
          overflow="hidden"
          _hover={{ borderColor: "blue.200" }}
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
              <SubsectionAccordian
                no={item.sectionId}
                year={year}
                search={search}
              />
            </Box>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default Gri;
