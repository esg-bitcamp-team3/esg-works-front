"use client";

import {
  Box,
  Button,
  Input,
  Text,
  Image,
  SimpleGrid,
  Flex,
  CloseButton,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa6";
import { useState } from "react";

const templates = [
  // { key: "blank", label: "빈 보고서", image: " " },
  { key: "list", label: "리스트 형식", image: "/list.png" },
  { key: "chart", label: "차트 형식", image: "/chart.png" },
];

export default function ReportModal() {
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  //   const handleCreate = () => {
  //     console.log("제목:", title);
  //     console.log("선택된 템플릿:", selected);
  //     onClose();
  //   };

  return (
    <Dialog.Root placement="center" motionPreset="scale">
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
          _hover={{
            bg: "#2F6EEA",
            width: "164px",
            justifyContent: "start",
          }}
          transition="width 0.2s ease"
          width="45px"
          display="flex"
          alignItems="start"
          justifyContent="start"
        >
          <FaPen />
          <Text
            mx="2"
            // display="none"
            color="white"
            _groupHover={{
              display: "inline",
            }}
          >
            새 보고서 생성
          </Text>
        </Button>
      </Dialog.Trigger>

      {/* 모달창 =================================================== */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={6} gap="6" minWidth='35vw'  minHeight='55vh'>
            {/* 제목 ============================== */}
            <Dialog.Header>
              <Dialog.Title fontSize="2xl" fontWeight="bold" color="#2F6EEA">
                새 보고서 생성
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
                {/* 제목 입력 ============================================ */}
                <Flex
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  width="100%"
                  gap={3}
                >
                  <Text fontSize="md" whiteSpace="nowrap">
                    제목
                  </Text>
                  <Input
                    rounded="md"
                    pl="2"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    flex="1"
                  />
                </Flex>
                {/* 템플릿 선택 ========================================== */}
                <SimpleGrid columns={4} gap={4}>
                  {templates.map((template) => (
                    <Box
                      key={template.key}
                      border="1px solid"
                      borderColor={
                        selected === template.key ? "blue.400" : "gray.200"
                      }
                      borderRadius="md"
                      textAlign="center"
                      p={4}
                      cursor="pointer"
                      onClick={() => setSelected(template.key)}
                      _hover={{ borderColor: "blue.300" }}
                    >
                      <Image
                        src={template.image}
                        alt={template.label}
                        w={"100%"}
                        //   boxSize="100px"
                        mx="auto"
                        mb={2}
                        objectFit="contain"
                      />
                      <Text fontSize="sm">{template.label}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Flex>
            </Dialog.Body>
            {/* 생성 버튼 ==================================================== */}
            <Dialog.Footer>
              <Flex justifyContent="flex-end" width="100%">
                <Button
                  bg="#2F6EEA"
                  variant="solid"
                  width="80px"
                  onClick={() => {
                    // title이 비어있지 않은 경우에만 이동
                    if (title.trim()) {
                      window.location.href = `/report/create?title=${encodeURIComponent(
                        title
                      )}`;
                    }
                  }}
                  _hover={{ bg: "#1D4FA3" }}
                >
                  생성
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
