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
  Avatar,
  Skeleton,
  Input,
  Switch,
} from "@chakra-ui/react";
import { tokenCheck } from "@/lib/api/auth/auth";
import { User } from "@/lib/interfaces/auth";
import Sidebar from "@/lib/components/Sidebar";

const MyPage = () => {
  const [user, setUser] = useState<User>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await tokenCheck();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex>
      <Sidebar />

      <Box flex="1" p={10} minH="100vh">
        <Heading fontSize="2xl" mb={8}>
          마이페이지
        </Heading>

        <VStack gap={8} align="stretch">
          {/* 프로필 섹션 */}
          <Box p={6} rounded="lg" shadow="sm">
            <HStack gap={5}>
              <Box></Box>
            </HStack>

            <VStack mt={6} gap={4} align="start">
              <Box w="full">
                <Text fontWeight="medium" mb={1}>
                  이름
                </Text>
              </Box>
              <Box w="full">
                <Text fontWeight="medium" mb={1}>
                  이메일
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* 보고서 현황 */}
          <Box p={6} rounded="lg" shadow="sm">
            <Heading size="md" mb={4}>
              작업 중인 ESG 보고서
            </Heading>
            <VStack gap={2} align="start">
              <Text>📄 2024 지속가능경영 보고서 - 작성 중</Text>
              <Text>📄 2023 환경 리스크 분석 보고서 - 검토 완료</Text>
            </VStack>
          </Box>

          {/* 환경설정 */}
          <Box p={6} rounded="lg" shadow="sm">
            <Heading size="md" mb={4}>
              환경설정
            </Heading>
            <VStack align="start" gap={5}></VStack>
          </Box>

          {/* 로그아웃 */}
          <Box textAlign="right">
            <Button colorScheme="red" variant="solid">
              로그아웃
            </Button>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default MyPage;
