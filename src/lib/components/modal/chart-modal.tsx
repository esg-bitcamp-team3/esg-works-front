"use client";

import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  CloseButton,
  Dialog,
  Portal,
  Select,
  createListCollection,
  InputGroup,
  Checkbox,
} from "@chakra-ui/react";
import { FaPen, FaSearch } from "react-icons/fa";
import { useState } from "react";

const gristandards = createListCollection({
  items: [
    { label: "Environment", value: "environment" },
    { label: "Social", value: "social" },
    { label: "Governance", value: "governance" },
  ],
});

export default function ChartModal() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Dialog.Root placement="center" motionPreset="scale" size="lg">
      <Dialog.Trigger asChild>
        <Button
          size="xl"
          p="3"
          borderRadius="full"
          bg="#2F6EEA"
          color="white"
          position="fixed"
          bottom="4"
          right="4"
        >
          <FaPen />
        </Button>
      </Dialog.Trigger>

      {/* 모달창 =================================================== */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={6} gap="6">
            {/* 제목 ============================== */}
            <Dialog.Header>
              <Dialog.Title fontSize="2xl" fontWeight="bold" color="#2F6EEA">
                새 차트 생성
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                gap="4"
              >
                <Flex
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  width="100%"
                  gap={3}
                >
                  {/* GRI Standards Select ============================================== */}

                  <Select.Root collection={gristandards} size="sm" w="200px">
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText
                          paddingLeft="2"
                          paddingRight="2"
                          placeholder="GRI Standards"
                        />
                      </Select.Trigger>
                      <Select.IndicatorGroup paddingRight="2">
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>

                    <Select.Positioner style={{ zIndex: 1000 }}>
                      <Select.Content p={2}>
                        {gristandards.items.map((gristandard) => (
                          <Select.Item
                            item={gristandard}
                            key={gristandard.value}
                            paddingLeft={4}
                            paddingRight="4"
                            paddingY={2}
                            rounded="md"
                            justifyContent={"start"}
                          >
                            {gristandard.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>

                  <InputGroup
                    startElement={
                      <Box pl="3" display="flex" alignItems="center">
                        <FaSearch />
                      </Box>
                    }
                    alignItems="start"
                  >
                    <Input placeholder="검색" />
                  </InputGroup>
                </Flex>
                {/* gri 지표 목록 =========================================== */}
                <Box
                  display="flex"
                  flexDirection="column"
                  borderRadius="md"
                  borderWidth="1px"
                  width="100%"
                  padding="4"
                  gap="2"
                  minHeight="200px"
                  maxHeight="250px"
                  overflowY="auto"
                >
                  {["퇴직율", "근속연수", "이직율"].map((item, index) => (
                    <Checkbox.Root
                      key={index}
                      checked={selected?.split(", ").includes(item) ?? false}
                      onCheckedChange={() => {
                        const isChecked = selected?.split(", ").includes(item);
                        if (isChecked) {
                          // Uncheck: remove tag and update state
                          setSelected((prev) => {
                            const updated = prev
                              ?.split(", ")
                              .filter((i) => i !== item)
                              .join(", ");
                            return updated && updated.length > 0
                              ? updated
                              : null;
                          });
                        } else {
                          // Check: add tag only if it's not already present
                          setSelected((prev) =>
                            prev ? `${prev}, ${item}` : item
                          );
                        }
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{item}</Checkbox.Label>
                    </Checkbox.Root>
                  ))}
                </Box>
                {/* 태그 ============================================ */}
                <Flex
                  direction="row"
                  justifyContent="start"
                  alignItems="start"
                  width="full"
                  overflowY="auto"
                  minHeight="50px"
                  gap={2}
                  wrap="wrap"
                >
                  {selected &&
                    selected.split(", ").map((item, index) => (
                      <Flex
                        key={index}
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                        borderWidth="0"
                        borderRadius="md"
                      >
                        <Text fontSize="sm" minWidth="fit-content">
                          {item}
                        </Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          _hover={{ bg: "white" }}
                          onClick={() => {
                            setSelected((prev) => {
                              const updated = prev
                                ?.split(", ")
                                .filter((i) => i !== item)
                                .join(", ");
                              return updated && updated.length > 0
                                ? updated
                                : null;
                            });

                            // Explicitly uncheck the checkbox using document query
                            const checkboxes = document.querySelectorAll(
                              'input[type="checkbox"]'
                            ) as NodeListOf<HTMLInputElement>;
                            checkboxes.forEach((checkbox) => {
                              if (
                                checkbox.nextElementSibling?.nextElementSibling
                                  ?.textContent === item
                              ) {
                                checkbox.checked = false;
                              }
                            });
                          }}
                        >
                          ✕
                        </Button>
                      </Flex>
                    ))}
                </Flex>
              </Flex>
            </Dialog.Body>

            {/* 생성 버튼 ==================================================== */}
            <Dialog.Footer>
              <Flex justifyContent="flex-end" width="100%">
                <Button
                  bg="#2F6EEA"
                  variant="solid"
                  width="80px"
                  // onClick={() => {
                  //   // title이 비어있지 않은 경우에만 이동
                  //   if (title.trim()) {
                  //     window.location.href = `/report/create?title=${encodeURIComponent(
                  //       title
                  //     )}`;
                  //   }
                  // }}
                  _hover={{ bg: "#1D4FA3" }}
                >
                  다음
                </Button>
              </Flex>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color="gray.500" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
