import { Accordion, Button, Flex, HStack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import DynamicInputForm from "../gri/InputForm";
import { Category } from "@/lib/interface";
import { tokenCheck } from "@/lib/api/auth/auth";
import { patchESGData } from "@/lib/api/patch";
import { postESGData } from "@/lib/api/post";
import { LuSave } from "react-icons/lu";
import { CategoryDetail } from "@/lib/api/interfaces/categoryDetail";
import { SubDynamicInputForm } from "./SubDynamicInputForm";

interface Prop {
  row: string;
  categoriesList: CategoryDetail[];
  year: string;
}
type FieldMap = Record<string, { value: string; isExisting: boolean }>;

const SubContentDetail = ({ row, categoriesList, year }: Prop) => {
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
          </HStack>
          <Accordion.ItemContent>
            <Accordion.ItemBody p={2}>
              {categoriesList.map((category) => (
                <SubDynamicInputForm
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

export default SubContentDetail;
