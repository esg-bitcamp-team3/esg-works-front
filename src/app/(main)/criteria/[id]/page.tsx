"use client";

import { getCriteria } from "@/lib/api/get";
import GriPage from "@/lib/components/griInput/GriPage";
import SectionForm from "@/lib/components/griInput/SectionForm";

import { Criterion } from "@/lib/interface";
import { Flex, Text, VStack } from "@chakra-ui/react";
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

  if (criterionId === "cri-01") {
    return (
      <Flex
        padding={4}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={6} top={24} position={"fixed"}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {criteria?.criterionName} 데이터 입력
          </Text>
          <GriPage
            criterionId={criterionId}
            criterionName={criteria?.criterionName || ""}
          />
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex
      padding={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={6} top={24} position={"fixed"}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {criteria?.criterionName} 데이터 입력
        </Text>
        <SectionForm criterionId={criterionId} />
      </VStack>
    </Flex>
  );
};
export default Page;
