import {
  Input,
  Text,
  Textarea,
  HStack,
  Button,
  Checkbox,
} from "@chakra-ui/react";
// Update the import path below to the correct relative path if needed
import { ToggleTip } from "@/components/ui/toggle-tip";
import { LuInfo } from "react-icons/lu";
import { useEffect, useState } from "react";
import { CategoryESGData } from "@/lib/api/interfaces/gri";

interface Props {
  category: CategoryESGData;
  onValueChange: (categoryId: string, value: string) => void;
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

export const DynamicInputForm = ({ category, onValueChange }: Props) => {
  const [field, setField] = useState("");

  const inputType = unitTypes[category.unit.unitId];

  useEffect(() => {
    setField(category.esgData?.value ?? "");
  }, [category]);

  return (
    <HStack
      p={4}
      w={"100%"}
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
      justify={"space-between"}
    >
      <HStack>
        <Text fontSize={"sm"} fontWeight={"medium"} maxLines={1} pl={2}>
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

      {inputType === "money" || inputType === "number" ? (
        <HStack justifyContent={"end"} padding={2}>
          <Input
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
            value={field}
            onChange={(e) => {
              setField(e.target.value);
            }}
            onBlur={() => onValueChange(category.categoryId, field)}
          />
          <Text color={"gray.500"} fontSize="xs">
            {category.unit.unitName}
          </Text>
        </HStack>
      ) : inputType === "boolean" ? (
        // <Checkbox
        //   isChecked={field === "true"}
        //   onChange={(e) => {
        //     const val = e.target.checked ? "true" : "false";
        //     setField(val);
        //   }}
        // />
        <> </>
      ) : inputType === "string" ? (
        <Textarea
          placeholder={category.unit.unitName}
          borderRadius="md"
          borderWidth={1}
          borderColor="gray.300"
          _hover={{ borderColor: "gray.400" }}
          _focus={{ borderColor: "gray.400", boxShadow: "sm" }}
          minH="120px"
          maxW="80%"
          resize="vertical"
          bg="white"
          transition="all 0.2s ease-in-out"
          value={field}
          onChange={(e) => {
            setField(e.target.value);
          }}
          onBlur={() => onValueChange(category.categoryId, field)}
        />
      ) : (
        <Input
          value={field}
          onChange={(e) => {
            setField(e.target.value);
          }}
          onBlur={() => onValueChange(category.categoryId, field)}
        />
      )}
    </HStack>
  );
};

export default DynamicInputForm;
