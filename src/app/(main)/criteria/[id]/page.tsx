"use client";

import { getCriteria, getMyCriteria } from "@/lib/api/get";
import GriPage from "@/lib/components/griInput/GriPage";
import SectionForm from "@/lib/components/griInput/SectionForm";
import { Criterion } from "@/lib/interface";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const criterionId = id ?? "";

  if (criterionId === "cri-01") {
    return (
      <Flex direction="column" align="center" justify="center">
        <Box
          width="70vw"
          minHeight="65vh"
          maxHeight="65vh"
          top={24}
          position={"fixed"}
        >
          <GriPage criterionId={criterionId} criterionName="GRI" />
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" align="center" justify="center">
      <Box
        width="70vw"
        minHeight="65vh"
        maxHeight="65vh"
        top={24}
        position={"fixed"}
      >
        <SectionForm criterionId={criterionId} />
      </Box>
    </Flex>
  );
};
export default Page;
