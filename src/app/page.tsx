import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <Flex
      direction="column"
      align="center"
      height="100vh"
      width="full"
      padding={4}
      spaceY={4}
    >
      <Flex direction="row" width="full" flexGrow={1}>
        <Box
          flex="1"
          padding={4}
          backgroundImage="linear-gradient(to right, #2196F3,rgb(0, 191, 255))"
          alignItems="center"
          justifyContent="center"
          display="flex"
          fontWeight="bold"
          fontSize="4xl"
          roundedLeft="lg"
          color="white"
        >
          ESG Works
        </Box>
        <Box
          flex="1"
          padding={4}
          fontSize="4xl"
          height="100%"
          roundedRight="lg"
          position="relative" // 필수: next/image의 fill 사용을 위해
        >
          <Image
            src="/images/swim.jpg"
            alt="Swimming"
            fill // 부모 Box 크기에 꽉 채움
            style={{ objectFit: "cover", borderRadius: "0 8px 8px 0" }} // roundedRight 적용
          />
        </Box>
      </Flex>
      <Flex direction="row" width="100vw" spaceX={4} flexGrow={1}>
        <Link href="/main">
          <Box
            flex="1"
            padding={4}
            bg="#f472b6"
            fontSize="4xl"
            height="100%"
            rounded="lg"
            width="20vw"
            textAlign={"center"}
          >
            MAIN
            <Image
              src="/images/main.png"
              alt="Main Image"
              width={50}
              height={50}
            />
          </Box>
        </Link>
        <Link href="/data">
          <Box
            flex="1"
            padding={4}
            bg="#f472b6"
            fontSize="4xl"
            height="100%"
            width="20vw"
            rounded="lg"
          >
            DATA
            <Image
              src="/images/data.png"
              alt="Data Image"
              width={50}
              height={50}
            />
          </Box>
        </Link>
        <Link href="/report">
          <Box
            flex="1"
            padding={4}
            bg="#f472b6"
            fontSize="4xl"
            height="100%"
            width="20vw"
            rounded="lg"
          >
            REPORT
            <Image
              src="/images/paper.png"
              alt="Report Image"
              width={50}
              height={50}
            />
          </Box>
        </Link>
      </Flex>
    </Flex>
  );
}
