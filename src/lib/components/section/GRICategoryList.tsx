import { InfoTip } from "@/components/ui/toggle-tip";
import {
  getCategories,
  getCategoriesBySectionStartingWith,
  searchGRIData,
} from "@/lib/api/get";
import { CategoryDetail } from "@/lib/api/interfaces/categoryDetail";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
import subCategory from "@/lib/data/gri";
import {
  Box,
  Clipboard,
  DataList,
  HStack,
  IconButton,
  Separator,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

type SubCategoryKey = keyof typeof subCategory;

interface CategoryListProps {
  year: string;
  query: string;
  sectionId: string;
}

const GRICategoryList = ({ sectionId, year, query }: CategoryListProps) => {
  const [dataList, setDataList] = useState<SectionCategoryESGData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    searchData();
  }, [sectionId, year, query]);

  const searchData = async () => {
    try {
      setLoading(true);
      const data = await searchGRIData({
        year,
        categoryName: query,
        sectionId,
      });
      setDataList(data || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack gap={0} width="100%">
      {Object.entries(subCategory[sectionId as SubCategoryKey] || {}).map(
        ([key, value], index) => (
          <Box key={sectionId + key + index} width="100%">
            <Text fontWeight="medium" fontSize="sm" width="100%" p={2}>
              {value}
            </Text>
            <Separator />
            {loading ? (
              <Box width="100%" p={8} textAlign="center">
                <Spinner />
              </Box>
            ) : (
              <DataList.Root orientation="horizontal" padding={4}>
                {dataList?.categoryESGDataList
                  ?.filter((category) =>
                    category.categoryId.startsWith(sectionId + key)
                  )
                  .map((item) => (
                    <DataList.Item
                      key={item.categoryId}
                      justifyContent={"space-between"}
                    >
                      <DataList.ItemLabel width="60%">
                        {item.categoryName}
                        <InfoTip>{item.description}</InfoTip>
                      </DataList.ItemLabel>
                      <DataList.ItemValue width="50%">
                        <HStack justify={"end"} width="100%">
                          <Text
                            fontWeight="medium"
                            textAlign={"end"}
                            fontSize="sm"
                          >
                            {item.esgData?.value || ""}
                          </Text>
                          <Text
                            fontWeight="medium"
                            textAlign={"end"}
                            fontSize="sm"
                            color="gray.500"
                          >
                            {item.unit.unitName && ` ${item.unit.unitName}`}
                          </Text>
                          <Clipboard.Root
                            value={
                              `${item.esgData?.value || ""}` +
                              `${item.unit.unitName}`
                            }
                          >
                            <Clipboard.Trigger asChild>
                              <IconButton variant="outline" size="xs">
                                <Clipboard.Indicator />
                              </IconButton>
                            </Clipboard.Trigger>
                          </Clipboard.Root>
                        </HStack>
                      </DataList.ItemValue>
                    </DataList.Item>
                  ))}
              </DataList.Root>
            )}
          </Box>
        )
      )}
    </VStack>
  );
};

export default GRICategoryList;
