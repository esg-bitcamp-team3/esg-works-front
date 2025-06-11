import { Accordion, Button, Flex, HStack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import DynamicInputForm from "./InputForm";
import { Category } from "@/lib/interface";
import { tokenCheck } from "@/lib/api/auth/auth";
import { patchESGData } from "@/lib/api/patch";
import { postESGData } from "@/lib/api/post";

interface Prop {
  row: string;
  categoriesList: Category[];
  year: string;
}
type FieldMap = Record<string, { value: string; isExisting: boolean }>;

const ContentDetail = ({ row, categoriesList, year }: Prop) => {
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

    for (const category of categoriesList) {
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
    <Flex w="100%">
      <Accordion.Root collapsible variant={"plain"}>
        <Accordion.Item value={"content"}>
          <HStack paddingRight={4}>
            <Accordion.ItemTrigger p={2}>
              <Text fontSize="sm" fontWeight="bold" color="gray.700">
                {row}
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
            <Accordion.ItemBody p={2}>
              {categoriesList.map((category) => (
                <DynamicInputForm
                  key={category.categoryId}
                  category={category}
                  year={year}
                  onFieldChange={handleFieldChange}
                />
              ))}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Flex>
  );
};

export default ContentDetail;
