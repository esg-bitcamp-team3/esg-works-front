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
    </>
  );
}
