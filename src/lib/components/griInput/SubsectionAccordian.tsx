import { Accordion, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import subCategory from "@/lib/data/gri";
import { Category } from "@/lib/interface";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCategories } from "@/lib/api/get";
import { tokenCheck } from "@/lib/api/auth/auth";
import { patchESGData } from "@/lib/api/patch";
import { postESGData } from "@/lib/api/post";
import DynamicInputForm from "../gri/InputForm";
import { CategoryESGData } from "@/lib/api/interfaces/gri";

interface Props {
  categoryESGDataList: CategoryESGData[];
}

type subSection = Record<string, CategoryESGData[]>;
type FieldMap = Record<string, { value: string; isExisting: boolean }>;

const SubsectionAccordian = ({ categoryESGDataList }: Props) => {
  const [value, setValue] = useState<string>("");

  const partedSection = useMemo(() => {
    const groupedBySection: subSection = {};
    Object.values(categoryESGDataList).forEach((item) => {
      const sectionId = item.categoryId.substring(3, 5);
      if (!groupedBySection[sectionId]) {
        groupedBySection[sectionId] = [];
      }
      groupedBySection[sectionId].push(item);
    });
    return groupedBySection;
  }, [categoryESGDataList]);

  const [categoryList, setCategoryList] = useState<CategoryESGData[]>([]);

  const setCategory = () => {
    // setCategoryList()
  };

  const [fieldValues, setFieldValues] = useState<FieldMap>({});

  const handleFieldChange = useCallback(
    (categoryId: string, value: string, isExisting: boolean) => {
      setFieldValues((prev) => ({
        ...prev,
        [categoryId]: { value, isExisting },
      }));
    },
    []
  );

  const outputList = useMemo(() => {
    return categoryList.map((category) => {
      const { value, isExisting } = fieldValues[category.categoryId] || {
        value: "",
        isExisting: false,
      };
      return { ...category, value, isExisting };
    });
  }, [categoryList, fieldValues]);

  // const handleSaveAll = useCallback(async () => {
  //   const user = await tokenCheck();
  //   if (!user) {
  //     console.error("User not authenticated");
  //     return;
  //   }

  //   for (const item of outputList) {
  //     const outputData = {
  //       categoryId: item.categoryId,
  //       corpId: user.corpId,
  //       year: ,
  //       value: item.value,
  //     };

  //     try {
  //       if (item.isExisting) {
  //         await patchESGData(outputData);
  //       } else {
  //         await postESGData(outputData);
  //       }
  //     } catch (error) {
  //       console.error(`Error saving category ${item.categoryId}`, error);
  //     }
  //   }
  // }, [outputList, year]);

  return (
    <Accordion.Root
      collapsible
      width="100%"
      value={[value]}
      onValueChange={(e) => setValue(e.value[0] || "")}
    >
      {Object.entries(partedSection).map(([key, value]) => (
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
                {subCategory[Object.values(value)[0].sectionId][key]}
              </Text>
            </Accordion.ItemTrigger>
            <Button
              variant={"solid"}
              // onClick={handleSaveAll}
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
                {Object.values(value).map((category) => (
                  <DynamicInputForm
                    key={category.categoryId}
                    category={category}
                    year={category.esgData?.year}
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
