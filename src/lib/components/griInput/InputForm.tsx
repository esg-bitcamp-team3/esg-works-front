import { PartialESGData } from "@/lib/interface";
import {
  Box,
  Input,
  Text,
  Textarea,
  Checkbox,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
// Update the import path below to the correct relative path if needed
import { ToggleTip } from "@/components/ui/toggle-tip";
import { LuInfo } from "react-icons/lu";
import { useCallback, useEffect, useState } from "react";
import { getDataByCorpYear } from "@/lib/api/get";
import { CategoryESGData } from "@/lib/api/interfaces/gri";

interface Props {
  category: CategoryESGData;
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

export const DynamicInputForm = ({ category, year, onFieldChange }: Props) => {
  const { control } = useForm();
  const [field, setField] = useState("");
  const [inputData, setInputData] = useState<PartialESGData>();

  const fieldCheck = useCallback(async () => {
    try {
      const data = await getDataByCorpYear({
        categoryId: category.categoryId,
        year: year,
      });
      if (data) {
        setInputData(data);
        setField(data.value ?? "");
        // 데이터가 존재하므로 상위에 전달
        onFieldChange?.(category.categoryId, data.value ?? "", true);
      } else {
        // 데이터 없음: 새로운 값 입력 준비
        setInputData(undefined);
        setField("");
        onFieldChange?.(category.categoryId, "", false);
      }
    } catch (error) {
      return null;
    }
  }, [year]);

  const inputType = unitTypes[category.unit.unitId];

  useEffect(() => {
    fieldCheck();
  }, [fieldCheck]);

  return (
    <Box
      minW="140%"
      p={4}
      borderWidth="1px"
      borderRadius="xl"
      mb={4}
      bg="white"
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <HStack
        gap={4}
        align="stretch"
        justifyContent={"space-between"}
        minW="600px"
      >
        <HStack>
          <Text fontSize={"sm"} fontWeight={"bold"} maxLines={1} pl={2}>
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

        <Controller
          name={category.categoryId}
          control={control}
          render={({ field: controllerField }) => {
            const commonProps = {
              ...controllerField,
              value: field,
              onChange: (e: any) => {
                const val = e.target.value;
                controllerField.onChange(val);
                setField(val);
                onFieldChange?.(category.categoryId, val, !!inputData);
              },
            };

            if (inputType === "money") {
              return (
                <HStack justifyContent={"end"} padding={2}>
                  <Input
                    {...commonProps}
                    type="number"
                    borderRadius="md"
                    borderWidth={1}
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "gray.400" }}
                    bg={"white"}
                    w={"80%"}
                    p={4}
                    placeItems={"end"}
                  />
                  <Text>{category.unit.unitName}</Text>
                </HStack>
              );
            } else if (inputType === "number") {
              return (
                <HStack justifyContent={"end"} padding={2}>
                  <Input
                    {...commonProps}
                    type="number"
                    borderRadius="md"
                    borderWidth={1}
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "gray.400" }}
                    bg={"white"}
                    w={"80%"}
                    p={4}
                    placeItems={"end"}
                  />
                  <Text>{category.unit.unitName}</Text>
                </HStack>
              );
            }

            if (inputType === "boolean") {
              return (
                <Checkbox.Root variant={"outline"}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              );
            }

            if (inputType === "string") {
              return (
                <Textarea
                  {...commonProps}
                  placeholder={category.unit.unitName}
                  borderRadius="md"
                  borderWidth={1}
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{ borderColor: "gray.400" }}
                  minH="120px"
                  maxW="80%"
                  resize="vertical"
                  bg="white"
                />
              );
            }

            return <Input {...commonProps} />;
          }}
        />
      </HStack>
    </Box>
  );
};

export default DynamicInputForm;
