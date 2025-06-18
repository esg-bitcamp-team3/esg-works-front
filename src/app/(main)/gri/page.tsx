"use client";

import GriPage from "@/lib/components/griInput/GriPage";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

const Page = () => {
  const criterionId = "cri-01"; // Example criterion ID
  const criterionName = "GRI"; // Example criterion name
  return (
    <Flex
      padding={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={6} top={24} position={"fixed"}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {criterionName} 데이터 입력
        </Text>
        <GriPage criterionId={criterionId} criterionName={criterionName} />
      </VStack>
    </Flex>
  );
};
export default Page;
