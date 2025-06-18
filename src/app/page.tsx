import { Box, Flex, Text, Image, VStack } from "@chakra-ui/react";

import Link from "next/link";
import Navbar from "@/lib/components/NavBar";

export default function LandingPage() {
  return (
    <>
      <Box as="nav" position="fixed" top={0} left={0} right={0} zIndex={10}>
        <Navbar />
      </Box>
      <Box
        minH="100vh"
        width="100%"
        backgroundImage="url('/esglandingpage.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        position="relative"
      >
        {/* 오버레이 박스 - 배경을 살짝 덮어서 가독성 업 */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(255,255,255,0.6)" // 원하는 투명도, 색상 조정
          zIndex={1}
        />
        {/* 콘텐츠 박스 */}
        <Flex
          position="relative"
          zIndex={2}
          direction="column"
          align="center"
          justify="center"
          minH="100vh"
          px={6}
        >
          <VStack gap={6}>
            <Image src="/logo-colored.png" alt="Logo" maxH="81px" />
            <Text fontSize="5xl" color="black" fontWeight="bold">
              ESG Works 웹 시작
            </Text>
            <Text
              fontSize="lg"
              color="black"
              fontWeight="light"
              textAlign="center"
            >
              ESG-Works 를 사용하면 GRI 기준에 따라 차트를 설정하고 <br />
              ESG경영 보고서를 작업할 수 있습니다.
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
                fontWeight="semibold"
                fontSize="xl"
              >
                지금 시작하기 →
              </Box>
            </Link>
          </VStack>
        </Flex>
      </Box>

      {/* <Flex
        direction="column"
        minHeight="100%"
        width="100%"
        marginTop="70px"
        // bg="gray.300"
        // overflow='auto'
        backgroundImage='/esglandingpage.png'
      >
        <Image
          src="/esglandingpage.png"
          alt="landingpage"
          maxH="1400px"
        />
        <Box
          height="fit-content"
          paddingTop="50px"
          paddingBottom="0px"
          width="100%"
          justifyContent="center"
          bg="#e3f6fc"
          // bg="linear-gradient(to bottom, #e3f6fc, #b9e6fb, #afe9e2, #c6f5d5, #fffbe6)"
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
          minH="70vh"
          bg="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="20"
        >
          <Image
            // w="1200px"
            // height="100%"
            src="/esglandingpage.png"
            alt="landingpage"
            maxH="1400px"
            borderRadius={"xl"}
          />
        </Box>

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
            ESG 경영보고서를 웹을을 활용하여 최상의 업무를 수행할 수 있습니다.
          </Text>

          <Image
            src="/esglandingpage2.png"
            alt="landingpage"
            maxH="500px"
            borderRadius="xl"
          />
        </VStack>

        <Box padding="10">
          <VStack
            gap={20}
            bg="gray.200"
            borderRadius="xl"
            padding="10"
            height="fit-content"
          >
            <HStack gap={6}>
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
          </VStack>
        </Box>

        <VStack>
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
      </Flex> */}
    </>
  );
}
