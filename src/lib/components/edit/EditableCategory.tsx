import { CategoryInput } from "@/lib/api/patch";
import {
  Button,
  Editable,
  Flex,
  HStack,
  IconButton,
  Input,
  Table,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { use, useEffect, useState } from "react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import UnitSelector from "./UnitSelector";
import { CategoryDetail } from "@/lib/api/interfaces/categoryDetail";
import { FaRegFloppyDisk } from "react-icons/fa6";

interface EditableTextProps {
  loading: boolean;
  initialValue: Partial<CategoryDetail>;
  onValueCommit: (value: Partial<CategoryInput>) => void;
  onDelete: (categoryId: string) => void;
}

const EditableCategory = ({
  initialValue,
  onValueCommit,
  loading = false,
  onDelete,
}: EditableTextProps) => {
  const [value, setValue] = useState<Partial<CategoryDetail>>(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveCompleted, setSaveCompleted] = useState(false);

  useEffect(() => {
    setSaveCompleted(!loading && isUpdating);
  }, [isUpdating, loading]);

  return (
    <Table.Row>
      <Table.Cell>
        <Input
          size="sm"
          border="none"
          bg="white"
          _focus={{ borderColor: "gray.400" }}
          value={value.categoryName || ""}
          onChange={(e) => {
            setValue({ ...value, categoryName: e.target.value });
          }}
        />
      </Table.Cell>
      <Table.Cell justifyContent="center" alignItems="center">
        <UnitSelector
          value={value.unit?.unitId || ""}
          onValueChange={(unitValue) => {
            setValue({ ...value, unit: unitValue });
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <Textarea
          fontSize="xs"
          color="gray.500"
          textAlign="start"
          border="none"
          bg="white"
          _focus={{ borderColor: "gray.400" }}
          value={value.description || ""}
          onChange={(e) => setValue({ ...value, description: e.target.value })}
          placeholder="설명을 입력하세요."
        />
      </Table.Cell>
      <Table.Cell
        textAlign="center"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            onValueCommit({ ...value });
            setIsUpdating(true);
          }}
          loading={loading}
        >
          {saveCompleted ? (
            <Text fontSize="xs" color="green.500">
              저장완료
            </Text>
          ) : (
            <Text fontSize="xs" color="gray.500">
              저장
            </Text>
          )}
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            if (!value.categoryId) return;
            onDelete(value.categoryId || "");
          }}
        >
          삭제
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default EditableCategory;
