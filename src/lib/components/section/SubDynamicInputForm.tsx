import { Category, PartialESGData } from "@/lib/interface";
import {
  Box,
  Input,
  Text,
  Textarea,
  HStack,
  Button,
  DataListItemLabel,
  DataListItemValue,
  DataListRoot,
  Clipboard,
  IconButton,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
// Update the import path below to the correct relative path if needed
import { ToggleTip } from "@/components/ui/toggle-tip";
import { LuInfo } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getDataByCorpYear } from "@/lib/api/get";
import { CategoryDetail } from "@/lib/api/interfaces/categoryDetail";

interface Props {
  category: CategoryDetail;
  year: string;
  onFieldChange?: (
    categoryId: string,
    value: string,
    isExisting: boolean
  ) => void;
}

const unitTypes: Record<string, "money" | "number" | "boolean" | "string"> = {
  "u-01": "money",
  "u-02": "number",
  "u-03": "number",
  "u-04": "number",
  "u-05": "number",
  "u-06": "number",
  "u-07": "number",
  "u-08": "number",
  "u-09": "number",
  "u-10": "number",
  "u-11": "number",
  "u-12": "number",
  "u-13": "boolean",
  "u-14": "string",
};

export const SubDynamicInputForm = ({ category, year }: Props) => {
  const [field, setField] = useState("");
  const [inputData, setInputData] = useState<PartialESGData>();

  const fieldCheck = async () => {
    try {
      const data = await getDataByCorpYear({
        categoryId: category.categoryId,
        year: year,
      });
      if (data) {
        setInputData(data);
        setField(data.value ?? "");
      } else {
        setInputData(undefined);
        setField("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputType = unitTypes[category.unit.unitId];

  useEffect(() => {
    fieldCheck();
  }, [year]);

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      mb={4}
      bg="white"
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <HStack gap={4} align="stretch" justifyContent={"space-between"}>
        <HStack>
          <Text fontSize="sm" fontWeight="bold">
            {category.categoryName}
          </Text>
          <ToggleTip
            content={category.description}
            size={"lg"}
            positioning={{ placement: "bottom-end" }}
            closeOnInteractOutside={false}
          >
            <Button size="xs" variant="ghost">
              <LuInfo />
            </Button>
          </ToggleTip>
        </HStack>

        {/* 아래는 type에 따라 렌더링 분기 */}
        {(inputType === "money" || inputType === "number") && (
          <>
            <HStack>
              <Text fontWeight="medium">
                {field}
                {category.unit.unitName && ` ${category.unit.unitName}`}
              </Text>
              <Clipboard.Root value={`${field}` + `${category.unit.unitName}`}>
                <Clipboard.Trigger asChild>
                  <IconButton variant="surface" size="xs">
                    <Clipboard.Indicator />
                  </IconButton>
                </Clipboard.Trigger>
              </Clipboard.Root>
            </HStack>
          </>
        )}

        {inputType === "boolean" && (
          <Text
            fontWeight="medium"
            color={String(field) === "true" ? "green.600" : "gray.500"}
          >
            {String(field) === "true" ? "있음" : "없음"}
          </Text>
        )}

        {inputType === "string" && (
          <>
            {" "}
            <Text fontWeight="medium">{field || "-"}</Text>
            <Clipboard.Root value={field}>
              <Clipboard.Trigger asChild>
                <IconButton variant="surface" size="xs">
                  <Clipboard.Indicator />
                </IconButton>
              </Clipboard.Trigger>
            </Clipboard.Root>
          </>
        )}
      </HStack>
    </Box>
  );
};
