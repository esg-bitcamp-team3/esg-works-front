"use client";

import { Box, Button, Flex, Input, InputGroup, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { TbSearch } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { FaRegFileWord } from "react-icons/fa";
import { Text, Stack } from "@chakra-ui/react";

import { TbLayoutGridFilled } from "react-icons/tb";
import { FiAlignLeft } from "react-icons/fi";
import { ButtonGroup } from "@chakra-ui/react";

import ListView from "@/lib/components/home/ListView";
// import LiveFilter from "@/lib/components/home/ListFilter";
import SearchBar from "@/lib/components/home/SearchBar";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "recent" | "interest"
  >("all");
  const [activeFilter2, setActiveFilter2] = useState<"list" | "layout">("list");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  // const handleSearch = () => {
  //   setSearchTrigger((prev) => prev + 1);
  // };

  return (
    <Flex
      padding={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={10}
      mt={10}
    >
      <VStack gap={6} top={8} position={"fixed"}>
        <h1>
          <Text fontStyle={"bold"} fontSize={30}>
            보고서 페이지
          </Text>
        </h1>

        {/* 검색창 */}
        <Box
          width="2xl"
          maxW="900px"
          bg="white"
          borderRadius="3xl"
          boxShadow="md"
          px={4}
          py={0}
          display="flex"
          alignItems="center"
        >
          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchTrigger((v) => v + 1);
            }}
          >
            <Flex gap={2} alignItems="center" width="300%" height={"20%"}>
              <SearchBar
                keyword={searchKeyword}
                setKeyword={setSearchKeyword}
                onSearch={() => setSearchTrigger((v) => v + 1)}
              />
              <Button
                type="submit"
                mt={2}
                bg="white"
                marginBottom="1%"
                borderRadius="full"
                color="black"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
              >
                <TbSearch size={24} color="currentColor" />
              </Button>
            </Flex>
          </form>
        </Box>

        <Stack>
          <Flex
            flexDirection={"column"}
            gap={4}
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
              <Box
                gap={4}
                display={"flex"}
                alignItems="center"
                defaultValue="all"
              >
                <Button
                  onClick={() => setActiveFilter("all")}
                  padding={4}
                  borderRadius="3xl"
                  bg={activeFilter === "all" ? "#2F6EEA" : "transparent"}
                  color={activeFilter === "all" ? "white" : "black"}
                  _hover={{
                    bg: activeFilter === "all" ? "#2F6EEA" : "blue.100",
                  }}
                >
                  <FaRegFileWord style={{ marginRight: 8 }} />
                  모두 보기
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
                  onClick={() => setActiveFilter("interest")}
                  padding={4}
                  borderRadius="3xl"
                  bg={activeFilter === "interest" ? "#2F6EEA" : "transparent"}
                  color={activeFilter === "interest" ? "white" : "black"}
                  _hover={{
                    bg: activeFilter === "interest" ? "#2F6EEA" : "blue.100",
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
                {/* <Button
                  variant="ghost"
                  onClick={() => setSort((prev) => !prev)}
                >
                  {sort ? <TbSortAscending /> : <TbSortDescending />}
                </Button> */}
              </Box>
            </ButtonGroup>

            {/* 실제 리스트 */}
            <ListView
              keyword={searchKeyword}
              filter={activeFilter}
              filter2={activeFilter2}
              searchTrigger={searchTrigger}
            />
          </Flex>
        </Stack>
      </VStack>
    </Flex>
  );
}
