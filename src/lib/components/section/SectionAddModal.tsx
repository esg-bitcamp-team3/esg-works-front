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
import { postCriterion, postSection } from "@/lib/api/post";
import { InputCriterion, InputSection } from "@/lib/api/interfaces/criterion";
import { toaster } from "@/components/ui/toaster";

interface SectionAddModalProps {
  criterionId: string;
  onSectionAdded: () => void;
}

export default function SectionAddModal({
  criterionId,
  onSectionAdded: onSectionAdded,
}: SectionAddModalProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [newSection, setNewSection] = useState("");

  const handleSave = async () => {
    try {
      const data: InputSection = {
        criterionId: criterionId,
        sectionName: newSection,
      };
      const response = await postSection(data);

      if (response) {
        toaster.success({
          title: "저장 완료",
        });
        onSectionAdded();
        setNewSection("");
      }
    } catch (err) {
      console.error("저장 에러:", err);
    }
  };

  return (
    <Dialog.Root initialFocusEl={() => ref.current}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="outline">
          지표 하위 항목 추가
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize={"md"}>
                새로운 지표 하위 항목 추가
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>세부 지표 항목 이름</Field.Label>
                  <Input
                    ref={ref}
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    bg="white"
                    _focus={{ borderColor: "gray.400" }}
                    size="md"
                  />
                  <Field.HelperText mt={1} color="gray.500" fontSize="sm">
                    지표 하위 항목의 이름을 입력해주세요
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
