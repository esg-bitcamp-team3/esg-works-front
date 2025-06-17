"use client";
import GriPage from "@/lib/components/gri/GriPage";
import StandardsPage from "@/lib/components/gri/StandardsPage";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

const Page = () => {
  return (
    <VStack paddingX="60">
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        GRI 데이터 입력
      </Text>
      <StandardsPage />
      {/* <GriPage /> */}
    </VStack>
  );
};
export default Page;
