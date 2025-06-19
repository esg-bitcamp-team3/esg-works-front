import { Box, Table, VStack } from "@chakra-ui/react";
import ContentDetail from "./ContentDetail";
import subCategory from "@/lib/data/gri";
import { Category } from "@/lib/interface";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/get";
import { CategoryDetail } from "@/lib/api/interfaces/categoryDetail";

type SubCategoryKey = keyof typeof subCategory;

interface Props {
  no: string;
  year: string;
}

const TableContent = ({ no, year }: Props) => {
  const categoryNo = no as SubCategoryKey;
  const [categoryList, setCategoryList] = useState<CategoryDetail[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataList = await getCategories(no);
        setCategoryList(dataList || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [no]);

  return (
    <Box
      minW="lg"
      borderWidth="1px"
      maxH="xl"
      overflowY="auto"
      borderRadius={"md"}
    >
      <VStack gap={0} width="100%">
        {Object.entries(subCategory[categoryNo] || {}).map(([key, value]) => (
          <Box
            key={key}
            width="100%"
            p={2}
            borderBottomWidth="1px"
            display="flex"
            justifyContent="center"
            textAlign="center"
          >
            <ContentDetail
              row={value}
              categoriesList={categoryList.filter((category) =>
                category.categoryId.startsWith(no + key)
              )}
              year={year}
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TableContent;
