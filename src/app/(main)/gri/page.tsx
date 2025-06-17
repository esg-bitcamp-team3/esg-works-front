"use client";

import GriPage from "@/lib/components/griInput/GriPage";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

const Page = () => {
  return (
    <Flex
      padding={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={6} top={24} position={"fixed"}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          GRI 데이터 입력
        </Text>
        <GriPage />
      </VStack>
    </Flex>
  );
};
export default Page;
