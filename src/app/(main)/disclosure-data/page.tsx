"use client";

import StandardsPage from "@/lib/components/griInput/StandardsPage";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

const Page = () => {
  return (
    <Flex direction="column" align="center" justify="center">
      <Box
        width="70vw"
        minHeight="65vh"
        maxHeight="65vh"
        top={24}
        position={"fixed"}
      >
        <StandardsPage />
      </Box>
    </Flex>
  );
};
export default Page;
