"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Skeleton,
  Input,
  Switch,
  DataList,
  Tabs,
  Icon,
  Collapsible,
  Separator,
} from "@chakra-ui/react";
import { getUserInfo, tokenCheck } from "@/lib/api/auth/auth";
import { LuBuilding, LuKeyRound, LuUser } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";

const MyPage = () => {
  const [userData, setUserData] = useState<Record<string, string>[]>([]);
  const [corporationData, setCorporationData] = useState<
    Record<string, string>[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        setUserData([
          { label: "이름", value: data?.name || "" },
          { label: "아이디", value: data?.id || "" },
          { label: "이메일", value: data?.email || "" },
          { label: "전화번호", value: data?.phoneNumber || "" },
        ]);
        setCorporationData([
          { label: "기업명", value: data?.corporation.corpName || "" },
          { label: "기업코드", value: data?.corporation.corpId || "" },
          { label: "주소", value: data?.corporation.address || "" },
          { label: "대표자명", value: data?.corporation.ceoName || "" },
          { label: "산업", value: data?.corporation.industry || "" },
          { label: "웹사이트", value: data?.corporation.webpage || "" },
        ]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex direction="column" align="center" justify="center">
      <Box
        width="70vw"
        height={"80vh"}
        top={24}
        position={"fixed"}
        overflowY="auto"
      >
        <Flex
          alignItems="center"
          borderBottom="2px solid"
          borderColor="gray.200"
          mb={12}
          width={"100%"}
          position={"sticky"}
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
            mb={4}
            textAlign={"start"}
            width="100%"
          >
            정보 수정
          </Text>
        </Flex>

        <Box mb={6}>
          <Tabs.Root
            orientation="vertical"
            defaultValue="profile"
            variant={"subtle"}
            h="40vh"
          >
            <Tabs.List
              width={"20%"}
              borderRight="2px solid"
              borderColor="gray.200"
            >
              <Tabs.Trigger
                value="profile"
                padding={6}
                _selected={{ color: "blue.500" }}
              >
                <Icon as={LuUser} fontSize="md" />
                <Text fontWeight="bold">개인 정보</Text>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="corporation"
                padding={6}
                _selected={{ color: "blue.500" }}
              >
                <Icon as={LuBuilding} fontSize="md" />
                <Text fontWeight="bold">기업 정보</Text>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="password"
                padding={6}
                _selected={{ color: "blue.500" }}
              >
                <Icon as={LuKeyRound} fontSize="md" />
                <Text fontWeight="bold">비밀번호 변경</Text>
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content
              value="profile"
              _open={{
                animationName: "fade-in, scale-in",
                animationDuration: "300ms",
              }}
              justifyContent="center"
              alignContent={"center"}
              alignItems={"center"}
            >
              <HStack
                gap={10}
                padding={6}
                paddingLeft={16}
                alignItems="start"
                width="100%"
                height={"100%"}
              >
                <Avatar size="xl" colorPalette={"gray"} />

                <DataList.Root
                  orientation={"horizontal"}
                  size={"md"}
                  width={"100%"}
                  gap={6}
                >
                  {userData.map((item) => (
                    <DataList.Item key={item.label}>
                      <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
                      <DataList.ItemValue>{item.value}</DataList.ItemValue>
                    </DataList.Item>
                  ))}
                </DataList.Root>
              </HStack>
            </Tabs.Content>
            <Tabs.Content
              value="corporation"
              _open={{
                animationName: "fade-in, scale-in",
                animationDuration: "300ms",
              }}
            >
              <DataList.Root
                orientation={"horizontal"}
                padding={6}
                paddingLeft={16}
                size={"md"}
                gap={6}
              >
                {corporationData.map((item) => (
                  <DataList.Item key={item.label}>
                    <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
                    <DataList.ItemValue>{item.value}</DataList.ItemValue>
                  </DataList.Item>
                ))}
              </DataList.Root>
            </Tabs.Content>
            <Tabs.Content
              value="password"
              _open={{
                animationName: "fade-in, scale-in",
                animationDuration: "300ms",
              }}
              w={"80%"}
              h={"100%"}
            >
              <VStack
                align="start"
                gap={6}
                padding={6}
                paddingLeft={16}
                width="100%"
                height={"100%"}
              >
                <Box
                  w="full"
                  display="flex"
                  flexDirection="row"
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"start"}
                >
                  <Text fontSize={"sm"} mb={1} w={"16%"}>
                    현재 비밀번호
                  </Text>
                  <Input
                    type="password"
                    width={"sm"}
                    borderRadius={"md"}
                    size="xs"
                    bg="white"
                    _focus={{ borderColor: "gray.400" }}
                  />
                </Box>
                <Box
                  w="full"
                  display="flex"
                  flexDirection="row"
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"start"}
                >
                  <Text fontSize={"sm"} w={"16%"}>
                    새 비밀번호
                  </Text>
                  <Input
                    type="password"
                    width={"sm"}
                    borderRadius={"md"}
                    size="xs"
                    bg="white"
                    _focus={{ borderColor: "gray.400" }}
                  />
                </Box>
                <Box
                  w="full"
                  display="flex"
                  flexDirection="row"
                  alignContent={"center"}
                  alignItems={"center"}
                  justifyContent={"start"}
                >
                  <Text fontSize={"sm"} w={"16%"}>
                    새 비밀번호 확인
                  </Text>
                  <Input
                    type="password"
                    width={"sm"}
                    borderRadius={"md"}
                    size="xs"
                    bg="white"
                    _focus={{ borderColor: "gray.400" }}
                  />
                </Box>
                <Box w="80%" display="flex" justifyContent="end" pt={6}>
                  <Button colorPalette={"blue"} variant="solid" size="xs">
                    변경하기
                  </Button>
                </Box>
              </VStack>
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      </Box>
    </Flex>
  );
};

export default MyPage;
