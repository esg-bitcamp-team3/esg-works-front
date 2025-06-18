import {
  Accordion,
  Box,
  Button,
  HStack,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import subCategory from "@/lib/data/gri";
import { useCallback, useState } from "react";
import { patchESGData } from "@/lib/api/patch";
import { postESGData } from "@/lib/api/post";
import {
  CategoryESGData,
  SectionCategoryESGData,
} from "@/lib/api/interfaces/gri";
import DynamicInputForm from "./InputForm";

type SubCategoryKey = keyof typeof subCategory;

interface Props {
  section: SectionCategoryESGData;
  year: string;
}

type FieldMap = Record<string, { value: string; isExisting: boolean }>;

const SubsectionAccordian = ({ section, year }: Props) => {
  const [value, setValue] = useState<string>("");

  const [fieldValues, setFieldValues] = useState<FieldMap>({});

  const [updateLoading, setUpdateLoading] = useState<string>("");

  const handleFieldChange = useCallback(
    (categoryId: string, value: string, isExisting: boolean) => {
      setFieldValues((prev) => ({
        ...prev,
        [categoryId]: { value, isExisting },
      }));
    },
    []
  );

  const outputList = useCallback(
    (categoryList: CategoryESGData[]) => {
      return categoryList.map((category) => {
        const { value, isExisting } = fieldValues[category.categoryId] || {
          value: "",
          isExisting: false,
        };
        return { ...category, value, isExisting };
      });
    },
    [fieldValues]
  );
  console.log("outputList", outputList(section.categoryESGDataList));

  const handleSaveAll = useCallback(
    async (key: number) => {
      setUpdateLoading(key.toString());
      try {
        for (const item of outputList(
          section.categoryESGDataList.filter((category) =>
            category.categoryId.startsWith(section.sectionId + key)
          )
        )) {
          const outputData = {
            categoryId: item.categoryId,
            year: year,
            value: item.value,
          };

          try {
            if (item.isExisting) {
              await patchESGData(outputData);
            } else {
              await postESGData(outputData);
            }
          } catch (error) {
            console.error(`Error saving category ${item.categoryId}`, error);
          }
        }
      } finally {
        setUpdateLoading("");
      }
    },
    [outputList, year]
  );

  return (
    <Accordion.Root
      collapsible
      width="100%"
      value={[value]}
      onValueChange={(e) => setValue(e.value[0] || "")}
    >
      {Object.entries(
        subCategory[section.sectionId as SubCategoryKey] || {}
      ).map(([key, value], index) => (
        <Accordion.Item
          key={key + index}
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
              variant={"subtle"}
              onClick={() => handleSaveAll(key as unknown as number)}
              colorPalette="gray"
              px={4}
              size={"sm"}
              loading={updateLoading === key.toString() ? true : false}
            >
              <Text fontSize="xs" color="gray.900">
                저장
              </Text>
            </Button>
          </HStack>

          <Accordion.ItemContent>
            <Separator />
            <VStack gap={2}>
              {section?.categoryESGDataList
                ?.filter((category) =>
                  category.categoryId.startsWith(section.sectionId + key)
                )
                .map((item) => (
                  <DynamicInputForm
                    key={item.categoryId}
                    category={item}
                    year={item.esgData?.year}
                    onFieldChange={handleFieldChange}
                  />
                ))}
            </VStack>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default SubsectionAccordian;
