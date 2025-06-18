"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { login } from "@/lib/api/auth/auth";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!id || !password) {
      setError("아이디와 비밀번호를 확인해주세요요.");
      return;
    }

    try {
      const tokenData = await login({
        id: id,
        password: password, // 비밀번호 추가
      });
      localStorage.setItem("token", tokenData?.token ?? "");
      toaster.success({
        title: "로그인 성공!",
      });

      // setTimeout(() => console.log('로그인 성공!'))
      // console.log(localStorage.getItem("token"));

      router.push("/main");
    } catch (error) {
      // toaster.error({
      //   title:
      //     error instanceof ApiError ? error.message : '알 수 없는 오류가 발생했습니다.'
      // })
    }
  };

  return (
    <Flex
      minH="100vh" // 화면 전체 높이
      justify="center" // 수평 중앙
      align="center" // 수직 중앙
      bg="1E1E1E"
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
            로그인
          </Heading>
          <Stack gap={6}>
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
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
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
                borderColor="gray.300"
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
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
              fontWeight="bold"
              onClick={handleSubmit}
            >
              로그인
            </Button>

            <Flex justify="center">
              <Text color="#00000099" fontSize="sm" mr={2}>
                기존 회원이 아니신가요?
              </Text>
              <Link
                href="/sign_up"
                color="#2F6EEA"
                fontSize="sm"
                textAlign="center"
                textDecoration="underline"
              >
                회원가입
              </Link>
            </Flex>
          </Stack>
        </Box>
      </Card.Root>
    </Flex>
  );
};

export default LoginPage;
