"use client";

import { Box, Button, Flex, Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";
import { TbSearch, TbSortAscending, TbSortDescending } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { FaRegFileWord } from "react-icons/fa";
import { Text, Stack } from "@chakra-ui/react";

import { TbLayoutGridFilled } from "react-icons/tb";
import { FiAlignLeft } from "react-icons/fi";
import { ButtonGroup } from "@chakra-ui/react";

import ListView from "@/lib/components/home/ListView";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<
    null | "all" | "recent" | "favorite"
  >("all");
  const [activeFilter2, setActiveFilter2] = useState<null | "list" | "layout">(
    "list"
  );
  const [sort, setSort] = useState<boolean>(false);

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
                최근에 변경
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
                <FiAlignLeft />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveFilter2("layout")}
                color={activeFilter2 === "layout" ? "#2F6EEA" : "gray.600"}
              >
                <TbLayoutGridFilled />
              </Button>
              <Button variant="ghost" onClick={() => setSort((prev) => !prev)}>
                {sort ? <TbSortAscending /> : <TbSortDescending />}
              </Button>
            </Box>
          </ButtonGroup>
          <ListView
            filter1={activeFilter || ""}
            filter2={activeFilter2 || ""}
            asc={sort}
          />
        </Flex>
      </Stack>
    </Flex>
  );
}
