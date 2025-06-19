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
import { getUserInfo, tokenCheck } from "@/lib/api/auth/auth";
import { User } from "@/lib/interfaces/auth";
import Sidebar from "@/lib/components/Sidebar";
import { patchPassword } from "@/lib/api/patch";

const MyPage = () => {
  const [user, setUser] = useState<User>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [changePasswordMessage, setChangePasswordMessage] = useState<
    string | null
  >(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const handleChangePassword = async () => {
    try {
      setChangePasswordSuccess(false);
      if (newPassword !== confirmPassword) {
        setChangePasswordMessage("비밀번호가 올바르지 않습니다.");
        return;
      }
      const data = await patchPassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      setChangePasswordMessage(data);
      setChangePasswordSuccess(true);
    } catch (error) {
      setChangePasswordSuccess(false);
      console.error("비밀번호 연동 오류", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex>
      <Sidebar
        isExpanded={false}
        setIsExpanded={function (value: boolean): void {
          throw new Error("Function not implemented.");
        }}
      />

      <Box p={5} minH="100vh" minW={"70vw"}>
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
              <Box w="full" display="flex" flexDirection="row" gap={14}>
                <Text fontWeight="medium" mb={1}>
                  이름
                </Text>
                <Text>{user?.name}</Text>
              </Box>
              <Box w="full" display="flex" flexDirection="row" gap={14}>
                <Text fontWeight="medium" mb={1}>
                  이메일
                </Text>
                <Text>{user?.email}</Text>
              </Box>
              <Box w="full" display="flex" flexDirection="row" gap={14}>
                <Text fontWeight="medium" mb={1}>
                  기업코드
                </Text>
                <Text>{user?.corpId}</Text>
              </Box>
              <Box w="full" display="flex" flexDirection="row" gap={14}>
                <Text fontWeight="medium" mb={1}>
                  전화번호
                </Text>
                <Text>{user?.phoneNumber}</Text>
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
              비밀번호 변경
            </Heading>
            <VStack align="start" gap={5}>
              <Box w="full" display="flex" flexDirection="row" gap={10}>
                <Text fontWeight="medium" mb={1}>
                  현재 비밀번호
                </Text>
                <Input
                  type="password"
                  width={"sm"}
                  borderRadius={"lg"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Box>
              <Box w="full" display="flex" flexDirection="row" gap={14}>
                <Text fontWeight="medium" mb={1}>
                  새 비밀번호
                </Text>
                <Input
                  type="password"
                  width={"sm"}
                  borderRadius={"lg"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Box>
              <Box w="full" display="flex" flexDirection="row" gap={5}>
                <Text fontWeight="medium" mb={1}>
                  새 비밀번호 확인
                </Text>
                <Input
                  type="password"
                  width={"sm"}
                  borderRadius={"lg"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Box>
              <Box w="full" display="flex" justifyContent="flex-end">
                <Button
                  colorScheme="red"
                  variant="solid"
                  borderRadius="lg"
                  loading={isChanging}
                  onClick={handleChangePassword}
                >
                  변경하기
                </Button>
              </Box>
              {changePasswordMessage && (
                <Text color={changePasswordSuccess ? "green.500" : "red.500"}>
                  {changePasswordMessage}
                </Text>
              )}
            </VStack>
          </Box>

          {/* 로그아웃 */}
        </VStack>
      </Box>
    </Flex>
  );
};

export default MyPage;
