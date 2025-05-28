"use client";

import {
  Box,
  Button,
  Flex,
  Group,
  Input,
  InputElement,
  InputGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuCreditCard } from "react-icons/lu";
import { TbSearch } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { FaRegFileWord } from "react-icons/fa";
import { Text, HStack, Stack, VStack } from "@chakra-ui/react";
import { MdPadding } from "react-icons/md";
import { SimpleGrid } from "@chakra-ui/react";
// TODO: Update the import path below to the correct location of color-palettes or create the file if it doesn't exist.
import { LuAlignLeft } from "react-icons/lu";
import { TbLayoutGrid } from "react-icons/tb";
import { TbLayoutGridFilled } from "react-icons/tb";
import { FiAlignLeft } from "react-icons/fi";
import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaCopy } from "react-icons/fa";

const reports = [
  { id: 1, title: "ESG 보고서 1", created_at: "2024-06-01" },
  { id: 2, title: "ESG 보고서 2", created_at: "2024-06-02" },
  { id: 3, title: "ESG 보고서 3", created_at: "2024-06-03" },
  { id: 4, title: "ESG 보고서 4", created_at: "2024-06-04" },
];

interface ReportProps {
  id: number;
  title: string;
  created_at: string;
}

const ReportListItem = ({ title, created_at }: ReportProps) => {
  return (
    <Box
      bg="white"
      shadow="md"
      borderRadius="md"
      borderColor="black"
      w="100%"
      h="70px"
      display="flex"
      alignItems="center"
      px={4}
    >
      <HStack padding={4} gap={4} justifyContent="space-between" w="100%">
        <HStack>
          <FaCopy style={{ marginRight: 8 }} />
          <Text>{title}</Text>
        </HStack>
        <Text color="gray.500" fontSize="sm" ml={4}>
          {created_at}
        </Text>
      </HStack>
    </Box>
  );
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<
    null | "all" | "recent" | "favorite"
  >("all");
  const [activeFilter2, setActiveFilter2] = useState<null | "list" | "layout">(
    "list"
  );
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  return (
    <Flex
      padding={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={10}
      mt={10}
    >
      <h1>
        <Text fontStyle={"bold"} fontSize={30}>
          보고서 페이지
        </Text>
      </h1>
      <InputGroup
        startElement={
          <Box pl="3" display="flex" alignItems="center">
            <TbSearch />
          </Box>
        }
        alignItems="start"
        w="2xl"
      >
        <Input placeholder="검색" borderRadius="2xl" size="lg" p="2" />
      </InputGroup>

      <Stack>
        <Flex
          flexDirection={"column"}
          gap={10}
          w="6xl"
          alignItems="start"
          h={"100%"}
        >
          <ButtonGroup
            size="sm"
            variant="outline"
            gap={10}
            justifyContent="space-between"
            w="100%"
          >
            <Box gap={4} display="flex" alignItems="center" defaultValue="all">
              <Button
                onClick={() => setActiveFilter("all")}
                padding={4}
                borderRadius="3xl"
                bg={activeFilter === "all" ? "#2F6EEA" : "transparent"}
                color={activeFilter === "all" ? "white" : "black"}
                _hover={{ bg: activeFilter === "all" ? "#2F6EEA" : "blue.100" }}
              >
                <FaRegFileWord style={{ marginRight: 8 }} />
                모두
              </Button>

              <Button
                onClick={() => setActiveFilter("recent")}
                padding={4}
                borderRadius="3xl"
                bg={activeFilter === "recent" ? "#2F6EEA" : "transparent"}
                color={activeFilter === "recent" ? "white" : "black"}
                _hover={{
                  bg: activeFilter === "recent" ? "#2F6EEA" : "blue.100",
                }}
              >
                <FaRegClock />
                최근에 열림
              </Button>

              <Button
                onClick={() => setActiveFilter("favorite")}
                padding={4}
                borderRadius="3xl"
                bg={activeFilter === "favorite" ? "#2F6EEA" : "transparent"}
                color={activeFilter === "favorite" ? "white" : "black"}
                _hover={{
                  bg: activeFilter === "favorite" ? "#2F6EEA" : "blue.100",
                }}
              >
                <FaRegStar />
                즐겨찾기
              </Button>
            </Box>

            <Box display="flex" alignItems="center">
              <Button
                variant="ghost"
                onClick={() => setActiveFilter2("list")}
                color={activeFilter2 === "list" ? "#2F6EEA" : "gray.600"}
              >
                {" "}
                <FiAlignLeft />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveFilter2("layout")}
                color={activeFilter2 === "layout" ? "#2F6EEA" : "gray.600"}
              >
                {" "}
                <TbLayoutGridFilled />
              </Button>
            </Box>
          </ButtonGroup>
          {activeFilter2 === "list" ? (
            <Stack gap={4} w="100%" h={"100%"}>
              {reports.map((report) => (
                <ReportListItem key={report.id} {...report} />
              ))}
            </Stack>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={10} w="100%">
              {reports.map((report) => (
                <Box
                  key={report.id}
                  borderRadius="md"
                  shadow="md"
                  overflow="hidden"
                  w="100%"
                >
                  <Box bg="blue.100" h="120px" /> {/* 이미지 or 썸네일 영역 */}
                  <Box
                    bg="white"
                    px={4}
                    py={2}
                    display="between"
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection="raw"
                    gap={2}
                  >
                    <Text color="gray.700">{report.title}</Text>
                    <Text color="gray.500" fontSize="sm">
                      {report.created_at}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
          <Flex
            position="fixed"
            left={0}
            justifyContent="center"
            alignItems="center"
            bottom="10"
            w="100%"
            mt={20}
          >
            <Pagination.Root count={20} pageSize={2} defaultPage={1}>
              <ButtonGroup variant="outline" size="sm">
                <Pagination.PrevTrigger asChild>
                  <IconButton>
                    <LuChevronLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(page) => (
                    <IconButton
                      key={page.value}
                      onClick={() => setCurrentPage(page.value)}
                      bg={
                        currentPage === page.value ? "#2F6EEA" : "transparent"
                      }
                      color={currentPage === page.value ? "white" : "black"}
                      _hover={{
                        bg: currentPage === page.value ? "#2F6EEA" : "blue.100",
                      }}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton>
                    <LuChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        </Flex>
      </Stack>
    </Flex>
  );
}
