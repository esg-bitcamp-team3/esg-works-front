import {
  Accordion,
  Box,
  Button,
  Flex,
  HStack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import ContentDetail from "./ContentDetail";
import subCategory from "@/lib/data/gri";
import { Category } from "@/lib/interface";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/get";
import { tokenCheck } from "@/lib/api/auth/auth";
import { patchESGData } from "@/lib/api/patch";
import { postESGData } from "@/lib/api/post";
import DynamicInputForm from "./InputForm";

type SubCategoryKey = keyof typeof subCategory;

interface Props {
  no: string;
  year: string;
  search: string;
}

type FieldMap = Record<string, { value: string; isExisting: boolean }>;

const SubsectionAccordian = ({ no, year, search }: Props) => {
  const categoryNo = no as SubCategoryKey;
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataList = await getCategories(no);
        // Map dataList to Category type if necessary
        setCategoryList(
          (dataList || []).map((item: any) => ({
            categoryId: item.categoryId,
            sectionId: item.sectionId ?? "",
            unit: item.unit,
            categoryName: item.categoryName,
            description: item.description,
          }))
        );
        setValue(search.substring(3, 5));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [no, search]);

  const [fieldValues, setFieldValues] = useState<FieldMap>({});

  const handleFieldChange = (
    categoryId: string,
    value: string,
    isExisting: boolean
  ) => {
    setFieldValues((prev) => ({
      ...prev,
      [categoryId]: { value, isExisting },
    }));
  };

  const handleSaveAll = async () => {
    const user = await tokenCheck();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    for (const category of categoryList) {
      const { value, isExisting } = fieldValues[category.categoryId] || {
        value: "",
        isExisting: false,
      };

      const outputData = {
        categoryId: category.categoryId,
        corpId: user.corpId,
        year,
        value,
      };

      try {
        if (isExisting) {
          await patchESGData(outputData);
        } else {
          await postESGData(outputData);
        }
      } catch (error) {
        console.error(`Error saving category ${category.categoryId}`, error);
      }
    }
  };

  return (
    <Accordion.Root
      collapsible
      width="100%"
      value={[value]}
      onValueChange={(e) => setValue(e.value[0] || "")}
    >
      {Object.entries(subCategory[categoryNo] || {}).map(([key, value]) => (
        <Accordion.Item
          key={key}
          value={key}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          mb={4}
          overflow="hidden"
          _hover={{ borderColor: "blue.200" }}
          transition="all 0.2s ease"
        >
          <HStack padding={4}>
            <Accordion.ItemTrigger p={2}>
              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                {value}
              </Text>
            </Accordion.ItemTrigger>
            <Button
              variant={"solid"}
              onClick={handleSaveAll}
              colorPalette="gray"
              px={6}
            >
              저장
            </Button>
          </HStack>
          <Accordion.ItemContent>
            <Box
              key={key}
              width="100%"
              p={2}
              borderBottomWidth="1px"
              display="flex"
              justifyContent="center"
              textAlign="center"
            >
              <VStack>
                {categoryList.map((category) => (
                  <DynamicInputForm
                    key={category.categoryId}
                    category={category}
                    year={year}
                    onFieldChange={handleFieldChange}
                  />
                ))}
              </VStack>
            </Box>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default SubsectionAccordian;
