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
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
import DynamicInputForm from "./DynamicInputForm";

type SubCategoryKey = keyof typeof subCategory;

interface Props {
  section: SectionCategoryESGData;
  year: string;
}

type Field = Record<string, string>;

const SubsectionAccordian = ({ section, year }: Props) => {
  const [value, setValue] = useState<string>("");

  const [fieldValues, setFieldValues] = useState<Field>({});

  const [updateLoading, setUpdateLoading] = useState<string>("");
  const [updated, setUpdated] = useState<string>("");

  const fieldChange = useCallback((categoryId: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  }, []);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSaveAll = async (key: string) => {
    setUpdateLoading(key);
    try {
      console.log("Saving data for key:", key);
      const savePromises = Object.entries(fieldValues).map(
        async ([categoryId, value]) => {
          const outputData = {
            categoryId: categoryId,
            year: year,
            value: value,
          };

          const existing = section.categoryESGDataList.find(
            (cat) => cat.categoryId === categoryId
          )?.esgData;

          if (existing) {
            return patchESGData(outputData);
          } else {
            return postESGData(outputData);
          }
        }
      );

      // 모든 요청 완료까지 기다림
      await Promise.all(savePromises);
      await delay(2000); // 1초 대기
      setUpdated(key);

      console.log("Data saved successfully for key:", key);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setUpdateLoading("");
    }
  };

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
              <Text fontSize="sm" color="gray.700">
                {value}
              </Text>
            </Accordion.ItemTrigger>
            <Button
              variant={"subtle"}
              onClick={() => handleSaveAll(key)}
              colorPalette="gray"
              px={4}
              size={"sm"}
              loading={updateLoading === key}
            >
              {updated === key ? (
                <Text fontSize="xs" color="green.500">
                  저장 완료
                </Text>
              ) : (
                <Text fontSize="xs" color="gray.900">
                  저장
                </Text>
              )}
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
                    onValueChange={fieldChange}
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
