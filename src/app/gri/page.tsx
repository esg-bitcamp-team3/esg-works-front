"use client";
import GriPage from "@/lib/components/gri/GriPage";
import { Flex, Text, VStack } from "@chakra-ui/react";

const Page = () => {
  return (
    <VStack padding={24} paddingX="60">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        GRI 데이터 입력
      </Text>
      <GriPage />
    </VStack>
  );
};
export default Page;
