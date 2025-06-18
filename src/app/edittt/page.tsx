"use client";
import CriterionEditPage from "@/lib/components/edit/CriterionEditPage";
import { Flex } from "@chakra-ui/react";

const Page = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      width="100vw"
      height="100vh"
      padding={4}
    >
      <CriterionEditPage />
    </Flex>
  );
};

export default Page;
