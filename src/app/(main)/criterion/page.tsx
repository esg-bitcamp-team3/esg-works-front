"use client";

import StandardsPage from "@/lib/components/griInput/StandardsPage";
import { Flex, Text, VStack, Box, Separator } from "@chakra-ui/react";

const Page = () => {
  return (
    <Flex
      padding={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      minHeight="100vh"
      bg="gray.50"
    >
      <VStack gap={6} top={24} position={"fixed"}>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          mb={4}
          textAlign={"start"}
          width="100%"
        >
          평가 항목 리스트
        </Text>
        <StandardsPage />
      </VStack>
    </Flex>
  );
};

export default Page;
