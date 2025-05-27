"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { toaster } from "@/components/ui/toaster";
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  Card,
  Heading,
} from "@chakra-ui/react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email: string) {
  return emailRegex.test(email);
}

const SignUpPage = () => {
  const [username, setUsername] = useState("");

  const [id, setId] = useState("");
  const [email, setEmail] = useState(""); // 이메일 추가
  const [phonenumber, setPhonenumber] = useState(""); // 이메일 추가
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [corpCode, setCorpCode] = useState(""); // 기업 코드 추가
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState(""); // 아이디 중복 오류 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 중복 오류 메시지
  const router = useRouter();

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    console.log("username:", username);

    if (
      !username ||
      !email ||
      !id ||
      !password ||
      !confirmPassword ||
      !phonenumber
    ) {
      setError("모든 필드를 채워주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (isValidEmail(email) === false) {
      setError("유효한 이메일 주소를 입력하세요.");
      return;
    }

    // try {
    //   await signup({
    //     username: id,
    //     password: password, // 비밀번호 추가
    //     name: username,
    //     email: email, // 이메일 추가
    //     phone: phonenumber // 전화번호 추가
    //   })
    //   toaster.success({
    //     title: '회원 가입 성공!'
    //   })
    //   router.push('/login')
    // } catch (error) {
    //   toaster.error({
    //     title:
    //       error instanceof ApiError ? error.message : '알 수 없는 오류가 발생했습니다.'
    //   })
    // }
  };

  return (
    <Flex
      minH="100vh" // 화면 전체 높이
      justify="center" // 수평 중앙
      align="center" // 수직 중앙
      bg="white" // 필요시 배경
    >
      <Card.Root
        boxAlign={"center"}
        display="flex"
        justifyContent="center"
        paddingLeft={4}
        paddingRight={4}
        minH="50vh"
        maxW="lg"
        mx="auto"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        borderWidth="2px"
        borderColor="gray.200"
      >
        <Box
          width={{ base: "100%", md: "400px" }}
          bg="transparent"
          p={8}
          borderRadius="md"
        >
          <Heading
            as="h2"
            size="3xl"
            color="#00000099"
            textAlign="center"
            mb={8}
          >
            회원가입
          </Heading>
          <Stack gap={4}>
            <Box>
              <Text color="black" mb={1} fontWeight="semi-bold">
                사용자명
              </Text>
              <Input
                variant="outline"
                padding={2}
                placeholder="이름을 입력해주세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="grey.300"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="semi-bold">
                아이디
              </Text>
              <Input
                variant="outline"
                padding={2}
                placeholder="아이디를 입력해주세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="grey.300"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="semi-bold">
                비밀번호
              </Text>
              <Input
                variant="outline"
                padding={2}
                placeholder="비밀번호를 입력해주세요"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="grey.300"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="semi-bold">
                비밀번호 확인
              </Text>
              <Input
                variant="outline"
                padding={2}
                placeholder="비밀번호를 입력해주세요"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="grey.300"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="semi-bold">
                기업 코드
              </Text>
              <Input
                variant="outline"
                padding={2}
                placeholder="기업 코드를 입력해주세요"
                value={corpCode}
                onChange={(e) => setCorpCode(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="grey.300"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="semi-bold">
                이메일
              </Text>
              <Input
                variant="outline"
                padding={2}
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="grey.300"
              />
            </Box>
            <Box>
              <Text color="black" mb={1} fontWeight="semi-bold">
                전화번호
              </Text>
              <Input
                variant="outline"
                padding={2}
                placeholder="010-0000-0000"
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
                color="black"
                _placeholder={{ color: "gray.400" }}
                borderColor="grey.300"
              />
            </Box>

            {error && (
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            )}

            <Button
              bg="#2F6EEA"
              color="white"
              _hover={{
                bg: "#1d4fa3",
                transform: "scale(1.05)",
              }}
              size="lg"
              fontWeight="semi-bold"
              onClick={handleSubmit}
            >
              회원가입
            </Button>
          </Stack>
        </Box>
      </Card.Root>
    </Flex>
  );
};

export default SignUpPage;
