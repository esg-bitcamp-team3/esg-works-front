"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useRef } from "react";
import { v4 as uuid } from "uuid"; // id 생성용

export default function CriterionSelector() {
  const ref = useRef<HTMLInputElement>(null);
  const [criteria, setCriteria] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [newCriterion, setNewCriterion] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/criteria");
        if (!res.ok) throw new Error("불러오기 실패");
        const data = await res.json();
        setCriteria(data.criteria || []);
      } catch (err) {
        console.error("불러오기 에러:", err);
        alert("기준 목록을 불러오는 데 실패했어요 😢");
      }
    };

    fetchCriteria();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token"); // 혹은 쿠키에서 꺼냄
      const response = await fetch("http://localhost:8080/api/criteria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 여기!
          // 인증 필요시 Authorization 헤더 추가
        },
        body: JSON.stringify({
          criteria: criteria.map((c) => ({
            criterionName: c.name,
          })),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("서버 응답:", errText);
        throw new Error("저장 실패!");
      }

      alert("저장 완료!");
    } catch (err) {
      console.error("저장 에러:", err);
      alert("문제가 발생했어요 😢");
    }
  };
  return (
    <Flex width="60vw" height="80vh">
      <Box>
        <Text textAlign="center" fontSize="xl" fontFamily={"bold"}>
          기준을 선택하세요
        </Text>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={4}
          justifyContent={"space-between"}
        >
          <Dialog.Root initialFocusEl={() => ref.current}>
            <Dialog.Trigger asChild>
              <Button
                backgroundColor="white"
                color="black"
                _hover={{ backgroundColor: "#3182ce", color: "white" }}
              >
                추가하기
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
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Dialog.ActionTrigger asChild>
                      <Button
                        onClick={() => {
                          handleSave();
                        }}
                      >
                        Save
                      </Button>
                    </Dialog.ActionTrigger>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Box>

        <Stack as="ul" gap={2} mt={4}>
          {criteria.map((c) => (
            <Box
              as="li"
              key={c.id}
              cursor="pointer"
              fontWeight={selected === c.id ? "bold" : "normal"}
              bg={selected === c.id ? "purple.100" : "transparent"}
              px={3}
              py={2}
              borderRadius="md"
              mb={1}
              onClick={() => setSelected(c.id)}
              _hover={{ bg: "purple.50" }}
              listStyleType="none"
            >
              {c.name}
            </Box>
          ))}{" "}
          <Button>수정</Button>
        </Stack>

        {selected && (
          <div style={{ marginTop: "16px" }}>
            선택한 기준:{" "}
            <strong>{criteria.find((c) => c.id === selected)?.name}</strong>
          </div>
        )}
      </Box>
    </Flex>
  );
}
