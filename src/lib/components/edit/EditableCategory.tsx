import { CategoryInput } from "@/lib/api/patch";
import {
  Button,
  Editable,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  Popover,
  Portal,
  Table,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { use, useEffect, useState } from "react";
import {
  LuArrowUpFromLine,
  LuCheck,
  LuCheckCheck,
  LuPencilLine,
  LuSave,
  LuX,
} from "react-icons/lu";
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
        <IconButton
          variant="plain"
          size="xs"
          onClick={() => {
            onValueCommit({ ...value });
            setIsUpdating(true);
          }}
          loading={loading}
        >
          {saveCompleted ? (
            <Icon as={LuCheck} color={"green.500"} />
          ) : (
            <Icon as={LuSave} color={"gray.800"} />
          )}
        </IconButton>
        <Popover.Root size={"xs"}>
          <Popover.Trigger asChild>
            <IconButton
              variant="plain"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Icon as={LuX} color={"gray.800"} />
            </IconButton>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content p={4}>
                <Popover.Arrow />
                <Popover.Body>
                  <Popover.Title fontWeight="medium">
                    {value.categoryName}
                    {value.categoryName?.slice(-1).match(/[가-힣]/)
                      ? [
                          ..."뺚뺛뺜뺝뺞뺟뺠뺡뺢뺣뺤뺥뺦뺧뺨뺩뺪뺫뺬뺭뺮뺯뺰뺱뺲뺳뺴뺵뺶뺷뺸뺹뺺뺻뺼뺽뺾뺿뻀뻁뻂뻃뻄뻅뻆뻇뻈뻉뻊뻋뻌뻍뻎뻏뻐뻑뻒뻓뻔뻕뻖뻗뻘뻙뻚뻛뻜뻝뻞뻟뻠뻡뻢뻣뻤뻥뻦뻧뻨뻩뻪뻫뻬뻭뻮뻯뻰뻱뻲뻳뻴뻵뻶뻷뻸뻹뻺뻻뻼뻽뻾뻿뼀뼁뼂뼃뼄뼅뼆뼇뼈뼉뼊뼋뼌뼍뼎뼏뼐뼑뼒뼓뼔뼕뼖뼗뼘뼙뼚뼛뼜뼝뼞뼟뼠뼡뼢뼣뼤뼥뼦뼧뼨뼩뼪뼫뼬뼭뼮뼯뼰뼱뼲뼳뼴뼵뼶뼷뼸뼹뼺뼻뼼뼽뼾뼿뽀뽁뽂뽃뽄뽅뽆뽇뽈뽉뽊뽋뽌뽍뽎뽏뽐뽑뽒뽓뽔뽕",
                        ].indexOf(value.categoryName.slice(-1)) !== -1
                        ? "을"
                        : "를"
                      : "을"}{" "}
                    삭제하시겠습니까?
                  </Popover.Title>
                </Popover.Body>
                <Popover.Footer display="flex" justifyContent="end">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => {
                      if (!value.categoryId) return;
                      onDelete(value.categoryId);
                    }}
                  >
                    삭제
                  </Button>
                </Popover.Footer>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </Table.Cell>
    </Table.Row>
  );
};

export default EditableCategory;
