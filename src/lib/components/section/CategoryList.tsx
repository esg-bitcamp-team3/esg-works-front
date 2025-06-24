import { InfoTip } from "@/components/ui/toggle-tip";
import { getCategories, searchESGData } from "@/lib/api/get";
import { CategoryDetail } from "@/lib/api/interfaces/categoryDetail";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
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

interface CategoryListProps {
  year: string;
  query: string;
  sectionId: string;
}

const CategoryList = ({ year, query, sectionId }: CategoryListProps) => {
  const [categoryList, setCategoryList] = useState<CategoryDetail[]>([]);
  const [dataList, setDataList] = useState<SectionCategoryESGData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataList = await getCategories(sectionId);
        setCategoryList(dataList || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [sectionId]);

  useEffect(() => {
    searchData();
  }, [sectionId, year, query]);

  const searchData = async () => {
    try {
      setLoading(true);
      const data = await searchESGData({
        year: "2020",
        sectionId: "201",
        categoryName: "",
      });
      console.log(data);
      setDataList(data || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack gap={0} width="100%">
      <Box key={sectionId} width="100%">
        {loading ? (
          <Box width="100%" p={8} textAlign="center">
            <Spinner />
          </Box>
        ) : (
          <DataList.Root orientation="horizontal" padding={4}>
            {dataList?.categoryESGDataList.map((item) => (
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
                    <Text fontWeight="medium" textAlign={"end"} fontSize="sm">
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
                        `${item.esgData?.value || ""}` + `${item.unit.unitName}`
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
    </VStack>
  );
};

export default CategoryList;
