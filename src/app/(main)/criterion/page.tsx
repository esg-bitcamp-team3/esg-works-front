"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { useRef } from "react";
import { postCriterion } from "@/lib/api/post";
import { InputCriterion } from "@/lib/api/interfaces/criterion";
import { getMyCriteria } from "@/lib/api/get";
import { Criterion } from "@/lib/interface";
import { Menu } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { deleteCriterion } from "@/lib/api/delete";
import { v4 as uuid } from "uuid";
export default function CriterionSelector() {
  const router = useRouter();

  const ref = useRef<HTMLInputElement>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
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
  // 삭제 기능 추가
  const handleDelete = async (criterionId: string) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      // 실제 삭제 API 호출 (deleteCriterion 함수가 필요)
      await deleteCriterion(criterionId);
      setCriteria((prev) => prev.filter((c) => c.criterionId !== criterionId));
      if (selected === criterionId) setSelected(null);
      alert("삭제 완료!");
    } catch (err) {
      console.error("삭제 에러:", err);
      alert("삭제에 실패했어요 😢");
    }
  };

  // 메뉴 항목 정의
  const links = [
    {
      title: "수정",
      onClick: (criterionId: string) => {
        router.push(`/criterion/${criterionId}/editor`);
      },
    },
    {
      title: "삭제",
      onClick: (criterionId: string) => handleDelete(criterionId),
    },
  ];
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
              display={"flex"}
              justifyContent={"space-between"}
              as="li"
              key={c.criterionId}
              cursor="pointer"
              fontWeight={selected === c.criterionId ? "bold" : "normal"}
              bg={selected === c.criterionId ? "purple.100" : "transparent"}
              px={3}
              py={2}
              borderRadius="md"
              mb={1}
              onClick={() => setSelected(c.criterionId)}
              listStyleType="none"
            >
              {c.criterionName}
              <Box>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button size="sm" variant="outline">
                      Select Anime
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        {links.map((link) => (
                          <Menu.Item
                            key={link.title}
                            value={link.title}
                            onClick={() => link.onClick(c.criterionId)}
                          >
                            {link.title}
                          </Menu.Item>
                        ))}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Box>
            </Box>
          ))}{" "}
        </Stack>

        {selected && (
          <div style={{ marginTop: "16px" }}>
            선택한 기준:{" "}
            <strong>
              {criteria.find((c) => c.criterionId === selected)?.criterionName}
            </strong>
          </div>
        )}
      </Box>
    </Flex>
  );
}
