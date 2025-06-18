import {
  Accordion,
  Box,
  Skeleton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
import { Section } from "@/lib/interface";
import { getGriByYearAndSectionId, getSearchSectionId } from "@/lib/api/get";
import SubsectionAccordian from "./SubsectionAccordian";

interface Props {
  section: string;
  year: string;
  search?: Section[];
}

const SectionAccordian = ({ section, year, search }: Props) => {
  const [sectionLoading, setSectionLoading] = useState(true);
  const [value, setValue] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);

  const fetchSections = useCallback(async () => {
    try {
      setSectionLoading(true);
      const data = await getSearchSectionId(section);
      setSections(data);
    } catch (error) {
      console.error("section fetch error", error);
    } finally {
      setSectionLoading(false);
    }
  }, [section]);

  const [sectionCategory, setSectionCategory] =
    useState<SectionCategoryESGData>();

  const [isLoading, setIsLoading] = useState(true);

  const clickSection = useCallback(
    async (year: string, section: string) => {
      try {
        setIsLoading(true);
        const data = await getGriByYearAndSectionId(year, section);
        setSectionCategory(data);
      } catch (error) {
        console.error("fetch 실패");
      } finally {
        setIsLoading(false);
      }
    },
    [section]
  );

  useEffect(() => {
    if (search && search.length > 0) {
      setSections(search);
      // setValue(search[0].sectionId);
      // clickSection(year, search[0].sectionId);
    } else {
      // setSections([]);
      // setValue("");
      fetchSections();
    }
    // fetchSections();
  }, [fetchSections, clickSection, search]);
  useEffect(() => {
    setValue("");
  }, [year]);

  if (sectionLoading) {
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
      {sections.map((item) => (
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
            onClick={() => clickSection(year, item.sectionId)}
          >
            <Text textStyle={"md"} fontWeight="bold" color="gray.700">
              {item.sectionId + " : " + item.sectionName}
            </Text>
            <Accordion.ItemIndicator colorPalette="blue" />
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            {value === item.sectionId && (
              <Box p={6} bg="white">
                {isLoading || !sectionCategory ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Spinner size="md" color="blue.500" />
                  </Box>
                ) : (
                  <SubsectionAccordian section={sectionCategory} year={year} />
                )}
              </Box>
            )}
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default SectionAccordian;
