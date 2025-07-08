"use client";

import MyCriteriaPage from "@/lib/components/griInput/MyCriteriaPage";
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
        <MyCriteriaPage />
      </Box>
    </Flex>
  );
};
export default Page;
