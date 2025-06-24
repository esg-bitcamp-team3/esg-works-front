"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  ButtonGroup,
  Stack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";

import { LuClock, LuFileText, LuLayoutGrid, LuSearch, LuStar, LuStretchHorizontal } from "react-icons/lu";

import ListView from "@/lib/components/home/ListView";
// import LiveFilter from "@/lib/components/home/ListFilter";
import SearchBar from "@/lib/components/home/SearchBar";
import Head from "next/head";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "recent" | "interest"
  >("all");
  const [activeFilter2, setActiveFilter2] = useState<"list" | "layout">("list");
  const [inputKeyword, setInputKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // const handleSearch = () => {
  //   setSearchTrigger((prev) => prev + 1);
  // };

  return (
    <VStack
      paddingTop="24"
      gap={10}
      alignItems="center"
      justifyContent="center"
      w='100%'
    >
      <Heading fontSize="3xl" fontWeight='bold'>
        ESG Works
      </Heading>

      {/* 검색창 */}
      <Box
        display="flex"
        width="46vw"
        paddingX="4"
        paddingY="1"
        bg="white"
        borderRadius="3xl"
        boxShadow="md"
        alignItems="center"
      >
        <SearchBar
          keyword={inputKeyword}
          setKeyword={setInputKeyword}
          onSearch={(keyword) => setSearchKeyword(keyword)}
        />
        <Button
          bg="white"
          borderRadius="full"
          color="black"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.2s"
          onClick={() => {
            setSearchKeyword(inputKeyword);
          }}
        >
          <LuSearch size={24} color="currentColor" />
        </Button>
      </Box>

      <VStack
        width='70vw'
        // height='50vh'
      >
        <ButtonGroup
          size="sm"
          variant="outline"
          gap={10}
          justifyContent="space-between"
          w="100%"
        >
          <Box gap={4} display={"flex"} alignItems="center" defaultValue="all">
            <Button
              onClick={() => setActiveFilter("all")}
              padding={4}
              borderRadius="3xl"
              bg={activeFilter === "all" ? "#2F6EEA" : "white"}
              color={activeFilter === "all" ? "white" : "black"}
              _hover={{
                bg: activeFilter === "all" ? "#2F6EEA" : "blue.100",
              }}
            >
              <LuFileText />
              모두 보기
            </Button>
            <Button
              onClick={() => setActiveFilter("recent")}
              padding={4}
              borderRadius="3xl"
              bg={activeFilter === "recent" ? "#2F6EEA" : "white"}
              color={activeFilter === "recent" ? "white" : "black"}
              _hover={{
                bg: activeFilter === "recent" ? "#2F6EEA" : "blue.100",
              }}
            >
              <LuClock />
              최근에 변경
            </Button>
            <Button
              onClick={() => setActiveFilter("interest")}
              padding={4}
              borderRadius="3xl"
              bg={activeFilter === "interest" ? "#2F6EEA" : "white"}
              color={activeFilter === "interest" ? "white" : "black"}
              _hover={{
                bg: activeFilter === "interest" ? "#2F6EEA" : "blue.100",
              }}
            >
              <LuStar />
              즐겨찾기
            </Button>
          </Box>

          <Flex width='fit-content' gap='4'>
            <IconButton
              as={LuStretchHorizontal}
              size="2xs"
              variant="plain"
              cursor='pointer'
              onClick={() => setActiveFilter2("list")}
              color={activeFilter2 === "list" ? "#2F6EEA" : "gray.600"}
            />
            <IconButton
              as={LuLayoutGrid}
              variant="plain"
              size="2xs"
              cursor='pointer'
              onClick={() => setActiveFilter2("layout")}
              color={activeFilter2 === "layout" ? "#2F6EEA" : "gray.600"}
            />
            {/* <Button
                  variant="ghost"
                  onClick={() => setSort((prev) => !prev)}
                >
                  {sort ? <TbSortAscending /> : <TbSortDescending />}
                </Button> */}
          </Flex>
        </ButtonGroup>

        {/* 실제 리스트 */}
        <ListView
          keyword={searchKeyword}
          filter={activeFilter} // 모두보기, 최근에 변경, 즐겨찾기
          filter2={activeFilter2} // 리스트, 갤러리 형태(오른쪽 아이콘)
        />
      </VStack>
    </VStack>
  );
}
