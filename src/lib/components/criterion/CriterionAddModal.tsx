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

export default function CriterionAddModal() {
  const ref = useRef<HTMLInputElement>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [newCriterion, setNewCriterion] = useState("");

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const data = await getMyCriteria();
        setCriteria(data || []);
      } catch (err) {
        console.error("불러오기 에러:", err);
        alert("기준 목록을 불러오는 데 실패했어요 😢");
      }
    };

    fetchCriteria();
  }, []);

  const handleSave = async () => {
    try {
      const data: InputCriterion = {
        criterionId: uuid(),
        criterionName: newCriterion,
      };
      const response = await postCriterion(data);

      // 저장 후 목록 새로고침
      const updated = await getMyCriteria();
      setCriteria(updated || []);
      setNewCriterion(""); // 입력값 초기화

      alert("저장 완료!");
    } catch (err) {
      console.error("저장 에러:", err);
      alert("문제가 발생했어요 😢");
    }
  };

  return (
    <Dialog.Root initialFocusEl={() => ref.current} placement="center">
      <Dialog.Trigger asChild>
        <Button
          size="xs"
          p="3"
          marginRight="1"
          bg="#2F6EEA"
          color="white"
          _hover={{ backgroundColor: "#3182ce", color: "white" }}
        >
          <FaPlus size="sm" />
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>기준 추가하기</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>기준이름</Field.Label>
                  <Input
                    ref={ref}
                    placeholder="Criterion"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                  />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">취소</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button
                  backgroundColor="#2F6EEA"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  추가하기
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" variant="plain" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
