import {
  Box,
  Flex,
  Stack,
  Text,
  Image,
  HStack,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

import Navbar from "@/lib/components/NavBar";
import { HiStar } from "react-icons/hi";

export default function Home() {
  return (
    <Flex
      direction="column"
      align="center"
      height="100vh"
      width="full"
      mt={58}
      pt={58}
      backgroundImage="linear-gradient( #f0ffff)"
    >
      <Flex direction="column" width="full">
        <Box
          mt={55}
          flex="1"
          padding={4}
          alignItems="center"
          justifyContent="center"
          display="flex"
          fontWeight="bold"
          fontSize="4xl"
        >
          <VStack mb={58}>
            <Image src="/logo-colored.png" alt="Logo" maxH="81px" />
            <Text fontSize="5xl" as="h1" color={"black"}>
              ESG Works 웹 시작
            </Text>
            <Text fontSize={"md"} color={"black"} fontWeight={"light"}>
              ESG-Works 를 사용하면 GRI 기준에 따라 차트를 설정하고 <br />
              ESG경영 보고서를 작업할 수 잇습니다.
            </Text>
          </VStack>
        </Box>
        <Box
          minH="100vh"
          bg="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={30}
        >
          <Image
            src="/esglandingpage.png"
            alt="landingpage"
            maxH="1880px"
            borderRadius={"xl"}
          />
        </Box>
        <Flex backgroundColor={"white"}>
          {/* Section 3: ESG 기준 대응 */}
          <Box
            minH="250vh"
            maxW="8xl"
            mx="auto"
            my={12}
            bg="gray.100"
            display="flex"
            justifyContent="center"
            borderRadius="2xl"
            width="full"
            boxShadow="xl"
            p={10}
          >
            <VStack gap={20}>
              <VStack gap={1}>
                <Text fontSize="5xl" textAlign="center">
                  GRI 기준에 따른 자동 템플릿을 활용하세요.
                </Text>
                <Text
                  fontSize="md"
                  color="black"
                  fontWeight="light"
                  textAlign="center"
                >
                  ESGWorks 웹을 사용하면 직원들이 <br />
                  ESG 경영보고서를 웹을을 활용하여 최상의 업무를 수행할 수
                  있습니다.
                </Text>
              </VStack>

              <Image
                src="/esglandingpage2.png"
                alt="landingpage"
                maxH="500px"
                borderRadius="xl"
              />

              <HStack gap={6}>
                <VStack></VStack>
                <Box
                  bg="white"
                  borderRadius="xl"
                  boxShadow="lg"
                  p={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src="/chart (2).png"
                    alt="landingpage"
                    maxH="500px"
                    borderRadius="xl"
                  />
                </Box>
                <Box>
                  <Text fontSize="5xl" textAlign="center">
                    GRI 기준에 따라서 차트를 구성해보세요.
                  </Text>
                  <Text
                    fontSize="md"
                    color="black"
                    fontWeight="light"
                    textAlign="center"
                  >
                    ESGWorks 웹을 사용하면 직원들이 <br />
                    ESG 경영보고서를 웹을을 활용하여 최상의 업무를 수행할 수
                    있습니다.
                  </Text>
                </Box>
              </HStack>
              <HStack gap={6}>
                <VStack>
                  <Text fontSize="5xl" textAlign="center">
                    GRI 기준에 따라서 차트를 구성해보세요.
                  </Text>
                  <Text
                    fontSize="md"
                    color="black"
                    fontWeight="light"
                    textAlign="center"
                  >
                    ESGWorks 웹을 사용하면 직원들이 <br />
                    ESG 경영보고서를 웹을을 활용하여 최상의 업무를 수행할 수
                    있습니다.
                  </Text>
                </VStack>
                <Box
                  bg="white"
                  borderRadius="xl"
                  boxShadow="lg"
                  p={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src="/chart (2).png"
                    alt="landingpage"
                    maxH="500px"
                    borderRadius="xl"
                  />
                </Box>
              </HStack>
              <HStack gap={6} mb={500}>
                <Box
                  bg="white"
                  borderRadius="xl"
                  boxShadow="lg"
                  p={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src="/chart (2).png"
                    alt="landingpage"
                    maxH="500px"
                    borderRadius="xl"
                  />
                </Box>
                <Box>
                  <Text fontSize="5xl" textAlign="center">
                    GRI 기준에 따라서 차트를 구성해보세요.
                  </Text>
                  <Text
                    fontSize="md"
                    color="black"
                    fontWeight="light"
                    textAlign="center"
                  >
                    ESGWorks 웹을 사용하면 직원들이 <br />
                    ESG 경영보고서를 웹을을 활용하여 최상의 업무를 수행할 수
                    있습니다.
                  </Text>
                </Box>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold">
                ESG Works 지금 시작해보세요!
              </Text>
              <Link href="/report" passHref>
                <Box
                  as="a"
                  bg="teal.400"
                  color="white"
                  px={6}
                  py={3}
                  rounded="md"
                  cursor="pointer"
                  _hover={{ bg: "teal.500" }}
                >
                  지금 시작하기기 →
                </Box>
              </Link>
            </VStack>
          </Box>
        </Flex>

        {/* Section 4: CTA */}
      </Flex>
      <Flex direction="row" width="100vw" spaceX={4} flexGrow={1}>
        {" "}
        <Navbar />
      </Flex>
    </Flex>
  );
}
