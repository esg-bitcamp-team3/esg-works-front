"use client";

import { getCriteria } from "@/lib/api/get";
import GriPage from "@/lib/components/griInput/GriPage";
import SectionForm from "@/lib/components/griInput/SectionForm";

import { Criterion } from "@/lib/interface";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const criterionId = id ?? "";
  const [criteria, setCriteria] = useState<Criterion>();

  useEffect(() => {
    getCriteria(criterionId)
      .then((data) => {
        if (data) setCriteria(data);
      })
      .finally();
  }, [criterionId]);

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
