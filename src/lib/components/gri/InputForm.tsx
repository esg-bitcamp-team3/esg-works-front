import { Category, ESGData } from "@/lib/interface";
import {
  Box,
  Input,
  Text,
  Textarea,
  Checkbox,
  Heading,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
// Update the import path below to the correct relative path if needed
import { ToggleTip } from "@/components/ui/toggle-tip";
import { LuInfo } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getDataByCorpYear } from "@/lib/api/get";

interface Props {
  category: Category;
  year: string;
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

export const DynamicInputForm = ({ category, year }: Props) => {
  const { control, handleSubmit } = useForm();
  const [field, setField] = useState("");

  const onSubmit = (data: any) => {
    console.log("Submitted:", data);
  };

  const inputType = unitTypes[category.unit.unitId];

  // useEffect(() => {
  //   const fetch = async () => {
  //     const data = getDataByCorpYear(year, category.categoryId);
  //     setField(data.value)
  //   };
  // });

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      mb={4}
      boxShadow="sm"
      bg="white"
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <HStack gap={4} align="stretch" justifyContent={"space-between"}>
        <HStack>
          <Text fontSize={"md"} fontWeight={"bold"}>
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
          render={({ field }) => {
            if (inputType === "money") {
              return (
                <HStack justifyContent={"end"} padding={2}>
                  <Input
                    {...field}
                    type="number"
                    borderRadius="md"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
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
                    {...field}
                    type="number"
                    borderRadius="md"
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.400" }}
                    w={"40%"}
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
                  {...field}
                  placeholder={category.unit.unitName}
                  borderRadius="md"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  minH="120px"
                  resize="vertical"
                />
              );
            }

            return <Input {...field} />;
          }}
        />
      </HStack>
    </Box>
  );
};

export default DynamicInputForm;
