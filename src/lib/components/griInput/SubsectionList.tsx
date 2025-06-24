import {
  Accordion,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
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
import { LuCheck, LuSave } from "react-icons/lu";

type SubCategoryKey = keyof typeof subCategory;

interface Props {
  section: SectionCategoryESGData;
  year: string;
}

type Field = Record<string, string>;

const SubsectionList = ({ section, year }: Props) => {
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
      setUpdated(key);

      console.log("Data saved successfully for key:", key);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setUpdateLoading("");
    }
  };

  return (
    <VStack w={"100%"}>
      {Object.entries(
        subCategory[section.sectionId as SubCategoryKey] || {}
      ).map(([key, value], index) => (
        <Box key={key + index} overflow="hidden" w={"100%"}>
          <HStack padding={4} py={6} w={"100%"} justifyContent="space-between">
            <Text
              flexShrink="0"
              fontSize="sm"
              fontWeight="600"
              color="gray.900"
            >
              {value}
            </Text>

            <IconButton
              variant="plain"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveAll(index.toString());
              }}
              loading={updateLoading === index.toString()}
            >
              {updated === index.toString() ? (
                <Icon as={LuCheck} color="green.500" />
              ) : (
                <Icon as={LuSave} color="gray.700" />
              )}
            </IconButton>
          </HStack>
          <Separator flex="1" size="sm" />

          <Box w={"100%"}>
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
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default SubsectionList;
