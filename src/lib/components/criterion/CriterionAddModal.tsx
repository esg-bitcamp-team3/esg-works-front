"use client";

import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { postCriterion } from "@/lib/api/post";
import { InputCriterion } from "@/lib/api/interfaces/criterion";
import { getMyCriteria } from "@/lib/api/get";
import { Criterion } from "@/lib/interface";
import { v4 as uuid } from "uuid";
import { FaPlus } from "react-icons/fa6";
import { toaster } from "@/components/ui/toaster";

interface CriterionAddModalProps {
  onCriterionAdded: () => void;
}

export default function CriterionAddModal({
  onCriterionAdded,
}: CriterionAddModalProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [newCriterion, setNewCriterion] = useState("");

  const handleSave = async () => {
    try {
      const data: InputCriterion = {
        criterionId: uuid(),
        criterionName: newCriterion,
      };
      const response = await postCriterion(data);

      if (response) {
        toaster.info({
          title: "저장 완료",
        });
        onCriterionAdded();
        setNewCriterion("");
      }
    } catch (err) {
      console.error("저장 에러:", err);
    }
  };

  return (
    <Dialog.Root initialFocusEl={() => ref.current}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline">
          {/* <FaPlus size="xs" style={{ marginRight: "4px" }} /> 기준 추가 */}
          평가 항목 추가
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize={"md"}>새로운 평가 항목 추가</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>평가 항목 이름</Field.Label>
                  <Input
                    ref={ref}
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    bg="white"
                    _focus={{ borderColor: "gray.400" }}
                    size="md"
                  />
                  <Field.HelperText mt={1} color="gray.500" fontSize="sm">
                    평가 항목의 이름을 입력해주세요
                  </Field.HelperText>
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" size="sm">
                  취소
                </Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button
                  onClick={() => {
                    handleSave();
                  }}
                  size="sm"
                  colorPalette={"blue"}
                  variant={"outline"}
                >
                  추가
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                variant="plain"
                _hover={{ backgroundColor: "#F7FAFC", color: "#2D3748" }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
