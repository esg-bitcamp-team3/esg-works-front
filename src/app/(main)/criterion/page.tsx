"use client";

import StandardsPage from "@/lib/components/griInput/StandardsPage";
import { Flex, Text, VStack, Box, Separator } from "@chakra-ui/react";

const Page = () => {
  return (
    <Flex
      padding={6}
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      minHeight="100vh"
      bg="gray.50"
    >
      <VStack
        gap={8}
        position="fixed"
        top={24}
        width="full"
        maxWidth="1400px"
        px={4}
      >
        <Box w="100%" position="relative" pb={4} bg="linear(to-r, blue.600, blue.400)">
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            mb={4}
            
            // bgClip="text"
            // letterSpacing="tight"
          >
            ESG 기준 리스트
          </Text>
          <Separator
            borderWidth="2px"
            borderRadius="full"
            bgGradient="linear(to-r, blue.500, blue.300)"
          />
        </Box>

        <StandardsPage />
      </VStack>
    </Flex>
  );
};

export default Page;